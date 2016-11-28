# Overview
This utilities maintanence app demonstrates multiple Foundation features coupled with Bluemix services to create an app that works seamlessly for the customer.

## CORD Americas Omega Team:

| Role | Name | Email | 
| --- | --- | --- | 
| Offering Manager | Carmel Schindelhaim | carmels@il.ibm.com |
| Manager | Jim McGarrahan | mcgarr@us.ibm.com |
| Scrum Master | Eric Garcia | engarcia@us.ibm.com |
| Developer | Michael Billau | billaumr@us.ibm.com |
| Developer | Ryan Berger | bergerr@us.ibm.com |
| Developer | Chevy Hungerford | cshunger@us.ibm.com |

--------------------------------

## Development Environment Setup

1. Install [mfpdev cli](npm install -g mfpdev-cli) `$ npm install -g mfpdev-cli`
2. Install [node.js](https://nodejs.org/en/)
2. Install [ionic](http://ionicframework.com/getting-started/) on the command line `$ npm install -g cordova ionic`
3. `$ git clone https://github.ibm.com/cord-americas/utilities-demo.git` this repository
4. `$ cd utilites-demo` into the app folder
5. `$ cordova platform add ios` add the ios platform
6. `$ cordova plugin add cordova-plugin-mfp` add the mfp plugin
7. `$ cordova build ios; cordova emulate ios` build ios platform and emulate

--------------------------------

## Contributing

If you would like to contribute to the development of this application please abide by the below listed guidelines.

The **master** branch is a protected branch and should never be worked on directly.  Once you have cloned the repo locally from [utilities-demo](https://github.ibm.com/cord-americas/utilities-demo) you can start the process.

You should ensure you are always up to date with the master branch.  This is done by `get fetch origin/master` and `git merge origin/master`.  This will at times cause conflicts, so please be sure to resolve all merge conflicts before making a commit.  This should be completed before starting work each day.

We follow the git-flow process outline [here](http://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow/)

 1. Make sure you are up to date with: `get fetch origin master && git merge origin/master`
 2. Create a new branch for each with the prefix [feature/ hotfix/]: `git checkout -b {prefix/name}`
 3. werk werk werk werk werk
 4. Try to make commits only on fully functioning code, and commit often. `git commit -m "message"`
 5. Check which files were changed. `git status`
 6. Add the relevant files. `git add {files}`
 7. Once you are ready to merge your feature/hotfix you will need to submit a pull request that will be review by a member of the team and pulled into master.
   1. Once again ensure you have the latest changes from master `get fetch origin/master && git merge origin/master`
   2. Resolve any merge conflicts
   3. `git push origin {branch name}` to push your branch to the remote repo
   4. Navigate to the github UI and make a *Pull Request*

--------------------------------

## Team Links:
  * [PowerPoint (storyboards)](https://ibm.box.com/s/hb1kn5kvp0aoi5pbdd923zkvh4iesba4)
  * [Mural](http://mur.al/m700RMLw)
  * [Bluemix Asset Inspection App](http://www.ibm.com/mobilefirst/us/en/mobilefirst-for-ios/industries/energy-and-utilities/asset-inspect/)
  * [Box note description](https://ibm.app.box.com/notes/73132132721)
  * [MFP Server on Bluemix](https://omega-mfp-dv-server.mybluemix.net/mfpconsole/)
  
