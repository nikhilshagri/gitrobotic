import React from 'react';

import DiffPanel from './DiffPanel';
import CommitMessage from './CommitMessage';

class StageSelective extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commitMsg: '',
    }
  }

  createCommit = (commitMsg) => {
    console.log(commitMsg);
    console.log(this.diffPanel);
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