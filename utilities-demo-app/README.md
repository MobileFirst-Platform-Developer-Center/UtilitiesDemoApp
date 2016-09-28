# Ionic application

## Build and Run the application

1. Clone repo locally with `git@github.ibm.com:cord-americas/utilities-demo.git`
1. `cd` to **utilities-demo/utilites-demo-app** directory
1. Ensure you are using a supported node version with `nvm use`.  This reads the specified node version of the project from **.nvmrc**
1. Add your desired platforms:
  * `ionic platform add ios@latest`
  * `ionic platform add android@latest`
1. Add the MobileFirst Cordova plug-in:
  * `ionic plugin add cordova-plugin-mfp`
1. Add missing resources with `ionic resources`


## Register application with IBM MobileFirst Platform Foundation Command Line Interface (CLI)

We need to register the application with our MFP server on Bluemix.
1. In **utilities-demo/utilites-demo-app** directory:
1. `mfpdev --help` to see the CLI help text and all available options
1. `mfpdev server info` to see a list of MobileFirst servers you may have already created
  * If this list is empty, `mfpdev server add` after creating a server on Bluemix.
1. `mfpdev app register <server-name>` 
  * If you have a local server running, it will default to that server if you leave off the `<server-name>` in the above command.


## Running and previewing the application on a device

1. To preview/simulate with MobileFirst Platform:
  * `mfpdev app preview`
  * Select *Mobile Browser Simulator* with *enter* key, platform with *space*
  * Hit *enter*
1. To run the app on a device, use Ionic CLI. It will use a simulator or running device.
  * `ionic run [ios/android]`
1. To emulate the application on a simulator
  * `ionic emulate [ios/android]`

## Contributing

If you would like to contribute to the project please review the [Contributing Guidelines](../CONTRIBUTING.md)
