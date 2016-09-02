# Ionic application

## Previewing the applications.

1. Clone repo locally with `git@github.ibm.com:cord-americas/utilities-demo.git`
1. `cd` to **utilities-demo/utilites-demo-app** directory
1. Add your desired platforms
	* `ionic platform add ios@latest`
	* `ionic platform add android@latest`
1. Add the `cordova-plugin-mfp`
	* `ionic plugin add cordova-plugin-mfp`
1. Add missing resources with `ionic resources`
1. Run the following commands
	* `cordova prepare`
	* `mfpdev app preview`

Now you will be previewing the application in a simulator that can hit mfp adapters.

