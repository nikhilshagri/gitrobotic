![gitrobotic.png](./gitrobotic-small.png)
# gitrobotic
A GUI for git built using Electron React, and [Nodegit](http://www.nodegit.org/). I created this project to get a grasp on the fundamentals of React, and javascript in general.

## Features
* View the commits belonging to a branch by selecting the branch name.
* Learn more about a particular commit; like the changes pertaining to the commit, by clicking on it.
* View complete diff of unstaged changes in Staging Area. Also, you can only choose to stage certain files to commit them later.
* Commit individual lines/hunks by selecting them in the selective staging area.
* Gitrobotic continually watches files for changes and updates itself automatically :)

## Build Instructions
run `npm install` first and then run `npm run rebuild`. The `rebuild` command is required to compile `nodegit`. Then run `npm run dev` to start the webpack dev server and electron simultaneously.

## Packaging
As of now, This application can only be built for linux systems with x64 arch (you can build it for other platforms by setting different options in `packageApp.js`, provided your machine meets the requirements for it. For more, see: [https://github.com/electron-userland/electron-packager/blob/master/docs/api.md](https://github.com/electron-userland/electron-packager/blob/master/docs/api.md)). To build the binary, just run `npm run package`. The binary file, along with other related files will be present in the `dist/bin` folder.

## TODO
* Add tagging capability.
* Allow users to clone repos.
* Push/Pull functionality.

## License
MIT
