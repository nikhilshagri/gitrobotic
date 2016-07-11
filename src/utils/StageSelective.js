import React from 'react';

import DiffPanel from './DiffPanel';
import CommitMessage from './CommitMessage';

import Promise from 'promise';
import Git from 'nodegit';

const gitFunctions = {

  getRepo: (path) => {
    const pathToRepo = require('path').resolve(path);

    return Git.Repository.open(pathToRepo);
  }
};

class StageSelective extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commitMsg: '',
    }
  }

  createCommit = (filesArr) => {

    if(filesArr.length === 0) {
      console.log('Please stage lines which are modified');
      return;
    }

    // console.log(filesArr);

    let repo;
    gitFunctions.getRepo(this.props.repo.path)
    .then( (repo) => {
      repo = repo;
      const isStaged = false;

      let promises = [];
      filesArr.forEach( (file, index) => {
        console.log(file.path, file.lines);
        promises.push(repo.stageLines(file.path,file.lines,isStaged));
      });
      return Promise.all(promises);
    });
  }

  collectCheckedLines = (commitMsg) => {

    const LINESTATUS = {
      UNMODIFIED: 32,
      ADDED: 43,
      DELETED: 45,
    };
    const checked = this.diffPanel.state.checked;
    const diffsArr = this.diffPanel.state.diffsArr;

    let filesArr = [];
    diffsArr.forEach( (diffFile, fileIndex) => {

      let linesArr = [];
      diffFile.diffs.forEach( (diff, diffIndex) => {
        diff.lines.forEach( (line, lineIndex) => {

          // only accept checked and modified lines
          if(checked[fileIndex][diffIndex][lineIndex] &&
          line.origin() !== LINESTATUS.UNMODIFIED)
            linesArr.push(line);
        });
      });

      if(linesArr.length !== 0)
        filesArr.push({lines: linesArr, path: diffFile.path.old});
    });

    this.createCommit(filesArr);
  }

  render = () => {
    return (
      <div>
        <CommitMessage buttonMsg='Commit selected lines!' commitCB={this.collectCheckedLines} />
        <DiffPanel {...this.props} showSelect={true} ref={(ref) => this.diffPanel = ref} />
      </div>
    );
  }
}

export default StageSelective;