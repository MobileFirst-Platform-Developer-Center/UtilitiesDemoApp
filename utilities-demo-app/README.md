# Ionic application

## Installing the application with `git`

1. Clone repo locally with `git@github.ibm.com:cord-americas/utilities-demo.git`
1. `cd` to **utilities-demo/utilites-demo-app** directory
1. Add your desired platforms
	* `ionic platform add ios@latest`
	* `ionic platform add android@latest`
1. Add the `cordova-plugin-mfp`
	* `ionic plugin add cordova-plugin-mfp`
1. Add missing resources with `ionic resources`

## Register application with IBM MobileFirst Platform Foundation Command Line Interface (CLI)
We need to register the application with our MFP server on Bluemix.
1. In **utilities-demo/utilites-demo-app** directory:
1. `mfpdev --help` to see the CLI help text and all available options
1. `mfpdev server info` to see a list of MobileFirst servers you may have already created
  * If this list is empty, `mfpdev server add` after creating a server on Bluemix.
1. `mfpdev app config` to select your MFP server

## Build and Run the application
1. `ionic resources` to add all image resources
1. `ionic platform add [ios/android]` to add the iOS or Android platform
1. To preview/simulate with MobileFirst Platform:
	* `mfpdev app preview`
  * Select *Mobile Browser Simulator* with *enter* key, platform with *space*
  * Hit *enter*
1. To run the app on a device, use Ionic CLI. It will use a simulator or running device.
  * `ionic run [ios/android]`

## Contributing
 1. Make sure you are up to date with: `git pull origin/master`
 1. Create a new branch relevant to your work: `git checkout -b {name}`
 1. werk werk werk werk werk
 1. There are many ways to submit a pull request, this is one way.
   1. `git commit -m 'message'` make commits after completing big chunks of work.
   1. `git rebase origin/master` This will merge the remote master branch onto your current branch, effectively updating your pull request
   1. Resolve any merge conflicts
   1. `git push origin {branch name}` to push your branch to the remote repo
   1. Navigate to the github UI and make a *Pull Request*
   1. See https://nathanleclaire.com/blog/2014/09/14/dont-be-scared-of-git-rebase/
