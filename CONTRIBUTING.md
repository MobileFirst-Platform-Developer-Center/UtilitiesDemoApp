## Contributing

If you would like to contribute to the development of this application please abide by the below listed guidelines.

The **master** branch is a protected branch and should never be worked on directly.  Once you have cloned the repo locally from [utilities-demo](https://github.ibm.com/cord-americas/utilities-demo) you can start the process.

You should ensure you are always up to date with the master branch.  This is done by `get fetch origin/master` and `git merge origin/master`.  This will at times cause conflicts, so please be sure to resolve all merge conflicts before making a commit.  This should be completed before starting work each day.

We follow the git-flow process outline [here](http://jeffkreeftmeijer.com/2010/why-arent-you-using-git-flow/)

 1. Make sure you are up to date with: `get fetch origin master && git merge origin/master`
 1. Create a new branch for each with the prefix [feature/ hotfix/]: `git checkout -b {prefix/name}`
 1. werk werk werk werk werk
 1. Try to make commits only on fully functioning code, and commit often. `git commit -m "message"`
 1. Once you are ready to merge your feature/hotfix you will need to submit a pull request that will be review by a member of the team and pulled into master.
   1. Once again ensure you have the latest changes from master `get fetch origin/master && git merge origin/master`
   1. Resolve any merge conflicts
   1. `git push origin {branch name}` to push your branch to the remote repo
   1. Navigate to the github UI and make a *Pull Request*
