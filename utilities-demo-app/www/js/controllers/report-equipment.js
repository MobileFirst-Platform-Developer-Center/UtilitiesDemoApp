// 'use strict';
/**
* Copyright 2016 IBM Corp.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
app.controller('ReportEquipmentCtrl', function($scope, $state, $ionicNavBarDelegate, $rootScope, $ionicPopup, WorkItems, $ionicPlatform, $cordovaCapture, $ionicLoading) {
	$ionicNavBarDelegate.showBackButton(true);
	$scope.fail = '';
	$scope.date = new Date();
	$scope.item = WorkItems.curItem;
	$scope.details = {
		'model': null,
		'serial': null,
		'manufacturer': null,
		'inspectedBy': "George Costanza",
		'failReason': null,
		'fileName': WorkItems.curItem._id + "_inspection.pdf",
		'notes': null,
		'manufactureYear': null,
		'lastInspected': null,
		'date': null,
		'inspectionPass': true
	};

	buildAddress = function(obj) {
		var address = '';
		if (obj.number != null) {
			address = address + obj.number + ' ';
		}
		if (obj.street != null) {
			address = address + obj.street + ' ';
		}
		address = address + obj.city + ', ' + obj.state + ' ' + obj.zip;
		return address;
	}

	$scope.address = buildAddress(WorkItems.curItem.location);

	// Var for original back function
	var oldSoftBack = $rootScope.$ionicGoBack;

	// Show warning popup when back is pressed
	$rootScope.$ionicGoBack = function() {
		var confirmPopup = $ionicPopup.confirm({
			title: 'Warning',
			template: 'The data on this page has not been submitted and will be lost. Continue?'
		});
		confirmPopup.then(function(res) {
			if(res) {
				$state.go('workItems');
			}
		});
	};

	// Show fail reason input if the inspection has failed
	$scope.showReason = function(fail) {
		if (fail == 'Fail') {
			$scope.details.inspectionPass = false;
		} else {
			$scope.details.inspectionPass = true;
		}
	}

	// Check whether to disable the submit button
	$scope.submitDisabled = function() {
		if (!$scope.details.inspectionPass && ($scope.details.failReason == null || $scope.details.failReason.length < 1)) {
			return true;
		}
		return false;
	}

	// Edit and submit to the adapter
	$scope.submit = function (details) {
		// Remove extra JSON fields
		delete WorkItems.curItem.valid;
        delete WorkItems.curItem.location.valid;
		delete WorkItems.curItem.$$hashKey;

		// Edit input values for adapter
		details.inspectionPass = $scope.details.inspectionPass;
		details.manufactureYear = parseInt(details.manufactureYear);
		WorkItems.curItem.inspectionFinished = true;
		WorkItems.curItem.details = details;

        // Clone the current item and remove the weather and created time
        var itemClone = WorkItems.curItem;
        delete itemClone.weather;
        // delete itemClone.;

        // PUT the item
		var req = new WLResourceRequest('adapters/Utilities/orders/' + itemClone._id, WLResourceRequest.PUT);
		req.setHeader('Content-type', 'application/json');
        console.log(itemClone);
		req.send(itemClone).then(
			function(response) {
                console.log('res');
                console.log(response.responseJSON);
				return response.responseJSON;
			},
			function(error) {
                console.log('error');
                console.log(error);
				return error;
			}
			);
		$state.go('workItems');
	}

	// Show the loading popup
  	$scope.show = function() {
  		$ionicLoading.show({
  			template: '<p>Sending file to Watson...</p><ion-spinner></ion-spinner>'
  		});
  	};

  	// Hide the loading popup
  	$scope.hide = function(){
  		$ionicLoading.hide();
  	};


  // Set up some scope'd variables for the record functionality
  $scope.recorder = {};    // Save an instance of our wav-recorder (on Android)
  $scope.audioFile = "";  // The Cordova File path for the audio file
  var keywords = ["Model","Manufacturer","Manufacturer Year","Status"];

  // Whenever we enter this view, start initializing the Watson STT
  // so that the file will be ready by the time we click the record button
  $scope.$on("$ionicView.enter", function(event, data){
    $scope.initialize();

  });

  // Whenever they leave the view for any reason, release the recorder
  $scope.$on("$ionicView.leave", function(event,data){
     $scope.recorder.release();
  })

  // This initialize() code will get called as soon as we navigate to this view
  $scope.initialize = function(){
  		console.log("Initializing WatsonSTT");
  		// Create cordova File using Cordova file plugin. We need to create it instead
      // of letting the plugin create it, so that we won't have any permission issues, etc

      // The next few methods follow the Cordova File plugin docs and attempt to
      // create an empty file in PERSISTENT storage that we can later record.

      // Wait for Cordova deviceReady event, so that the fileSystem is available
      // We can use ionicPlatform.ready(), the Ionic version of deviceReady
      // See: https://forum.ionicframework.com/t/how-to-use-requestfilesystem-with-angularjs-ionic/2144/5
      $ionicPlatform.ready(function(){

        //window.requestFileSystem(window.TEMPORARY, 5 * 1024 * 1024, function (fs) {
       // persistant definitly works! We are having problems with TEMPORARY
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 5*1024*1024, function (fs) {

            // Create a .wav file, which is accepted by Watson API and is also the
            // default recording format for iOS when using the MediaCapture plugin
            // For Android, MediaCapture records in .3ggp and some other formats
            // so we will use a third-party recorder to record in .wav format
            // Alternatively, we could transcode the audio format on the adapter
            var f = "watsonSTT-"+Date.now()+".wav";
            createFile(fs.root, f, false);

          },function(err){
            console.log("Error opening file system: " + JSON.stringify(err));
          });
      },false);
    };

  // Creates a new file or returns the file if it already exists.
  function createFile(dirEntry, fileName, isAppend) {
      dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {
          // For Android, we need to set up the third party wav-recorder plugin
          // from here: https://github.com/petrica/wav-recorder
          // For iOS, we need to set up Cordova MediaCapture plugin
          $scope.audioFile = fileEntry.toURL();
          try{
          if( $ionicPlatform.is("Android")){
            $scope.recorder = new martinescu.Recorder($scope.audioFile , { sampleRate: 22050 }, recorderStatusChangeCallback, bufferCallback);
          }else{
            // Need to "stub out" the wav recorder functionality here with the MediaCapture API
            // These are the only recoder() methods we use
            $scope.recorder = {};
            $scope.recorder.release = {};
          }
        }catch(e){alert(e)};

          return fileEntry.toInternalURL(); //fullPath;//fileEntry
      }, function(createFileError){
        console.log("Error creating a file" + JSON.stringify(createFileError));
      });
  };

  // This gets called A LOT when you are recording. Uncomment during debug to verify
  // that you are currently recording
  var bufferCallback = function(b){
    //console.log(b);
  }

  // This function is called every time the wav-recorder state changes.
  // This function drives a lot of our recorder state, eg, we do not have a
  // separate button to "upload" but instead do that automatically in this method
  var recorderStatusChangeCallback = function (mediaStatus, error) {

    if (martinescu.Recorder.STATUS_ERROR == mediaStatus) {
      alert("Error recording, please release recorder and try again." + JSON.stringify(error));
      console.log("Error recording, please release recorder and try again." + JSON.stringify(error))
    }else{

      if(mediaStatus == martinescu.Recorder.STATUS_READY){
        // When we call the record() meethod on the Recorder, the state will be
        // STATUS_READY at first, so we can use this to code block to give them an
        // instructional popup if we want. If they have hit record() the recorder
        // will already be recording in this state, so don't let them read too much!
        var t = 'Recording Now! Say these keywords:<br><br>';
         t += keywords.toString().replace(/,/g, "<br><br>");
        t+='<br><br>Hit "Stop Recording" to save and uplaod!';

        var alertPopup = $ionicPopup.alert({
    			title: 'Recording now!',
    			template: t,
    			okText: "Stop Recording"
    		});
    		alertPopup.then(function(res) {
            $scope.recorder.stop();
        });

      }else if(mediaStatus == martinescu.Recorder.STATUS_STOPPED){
        console.log("Recorder has stopped! Auto uploading now...");
        uploadToAdapter($scope.audioFile);
      }
    }
  }

  // This method may need to do something different for iOS record()
  // which is why it is a method instead of just calling $scope.record() from HTML
  $scope.record = function(){

    if( $ionicPlatform.is("Android")){
        $scope.recorder.record();
    }else{
      //var d = 60*5;
      var options = { limit: 1};//, duration: d }  // 5 minutes max
     $cordovaCapture.captureAudio(options).then(function(audioData) {
       // Success! Audio data is here
       uploadToAdapter(audioData[0].localURL);

     }, function(err) {
       alert("Error occured recording from iOS:" + err);
     });

   }//if ios
  }


  // Select a pre-recorded audio file and try to send it to Watson
  // This uses another 3rd party Cordova plugin:
  //    https://github.com/don/cordova-filechooser
  // This was also difficult to use because we needed to use the correct URI
  // The FileTransfer docs say a cdv:// will work, but that's not what I experienced
  $scope.selectExistingFile = function(){
    // iOS just does not get to open files for now
    if( $ionicPlatform.is("Android")){
      fileChooser.open(function(filePath){
        console.log("Got selected file:" + filePath);
         // Convert to cordova file uri using another 3rd party plugin
         // https://github.com/hiddentao/cordova-plugin-filepath
         // this resolveNativePath() seems to work, but it is only available on Android

         window.FilePath.resolveNativePath(filePath, function(uri){
           console.log("resolving native path to: " + uri);
           uploadToAdapter(uri);
         }, function(e){
           console.log("error in resolving file path with nativePath" + e);
         });

      },function(e){
        console.log("error from selectExistingFile:fileChooser.open():" + e);
      });
    }else{
      alert("Selecting files on iOS is not currently supported");
      return;
    }// is android
  };

  // Pop up a little Ionic dialog informing the user how to use the
  // voice recorder to fill out the form using WatsonSTT
  $scope.getHelp = function(){
    $ionicPopup.alert({
      title: 'Complete Form with Watson Speeh to Text ',
      templateUrl: 'templates/info-popup.html',
      cssClass: 'widepopup' // Not sure that this CSS is working
    });
  }

  // Reset the state of the recorder if they mess up
  // I think it is best to just recreate the file and everything
  $scope.resetRecorder = function(){
    $scope.recorder.release();
    $scope.initialize();
  }

  function uploadToAdapter(path){
      // This method uses WL.client to send the audio file directly to our Java adapter
      console.log("uploading to adapter, path:" + path);

      $scope.show();  // Show the loading dialog
      // We need to get the acutal File object and convert it to a base64 string
      // which we can then send as a Form paramater to our MFP adapter
      window.resolveLocalFileSystemURL(path, function(fileEntry) {
              console.log(fileEntry);
              console.log(JSON.stringify(fileEntry));

             fileEntry.file(function(fileObj) {
                 console.log("Size = " + fileObj.size);
                // console.log(JSON.stringify(fileObj));
                try{
                   // We need to convert the file to a base64 string to send with the
                   // sendFormParameters API() in MobileFirst
                   var reader = new FileReader();
                   var req = new WLResourceRequest('/adapters/WatsonJava/uploadBase64Wav', WLResourceRequest.POST);
                  // http://stackoverflow.com/questions/16964260/phonegap-readasdataurl
                   reader.readAsDataURL(fileObj);
                    // You will see the file-type seems to be: data:audio/x-wav;base64
                    // Not sure where 'x-wav' comes from, but we remove it in the adapter anyway

                   reader.onloadend = function(){
                       var data = reader.result;
                       // In JavaScript adapters, we need to send a file as base64 encoded Formparamters:
                       // https://mobilefirstplatform.ibmcloud.com/tutorials/en/foundation/8.0/application-development/resource-request/javascript/#sendformparameters-json
                        var params = {};
                        params.audioFile = data; // 'audioFile' is the Form paramater in the JAXRS @FORM paramater
                        console.log("sending formPararams theaudio:" + JSON.stringify(params));

                        //Attach the Keywords as query paramaters
                        req.setQueryParameter("keywords", keywords);

                        req.sendFormParameters(params).then(function (response) {
                               $scope.hide();
                               alert("Transcript from Watson received. The entire transcript will be saved in Comments section.");
                               parseWatsonResponse(response);

                        },function(e){
                               console.log(JSON.stringify(e));
                               alert("No recording could be parsed by Watson, please try again");
                        });
                  }// reader onloadend

                 }catch(e){console.log("error:" +e)}


          });//fileENtry
      });//resolveLocalFileSystemURL
  }
    // Parse the response from Watson Speech to Text service
    // Here you can parse out the keywords and fill in the appropriate form fields
  function parseWatsonResponse(response){
    console.log(JSON.stringify(response));
    // Here we will update based on our keywords data
    $scope.details.comments = response.responseText;
    $scope.apply();
  }
});
