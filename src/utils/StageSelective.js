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

const constStyles = {
  fontFamily: `apple-system,
          BlinkMacSystemFont,"Segoe UI",
          Roboto,Helvetica,Arial,sans-serif,
          "Apple Color Emoji","Segoe UI Emoji",
          "Segoe UI Symbol"`,
  darkRed: '#b60a0a',
  grey: '#ededed',
  blue: '#9CE8FA',
  darkBlue: '#0C6990'
};

class StageSelective extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commitMsg: '',
    }
  }

  createCommit = (filesArr, commitMsg) => {

    if(filesArr.length === 0) {
      console.log('Please stage lines which are modified');
      return;
    }

    // console.log(filesArr);

    let repo;
    gitFunctions.getRepo(this.props.repo.path)
    .then( (repoResult) => {
      repo = repoResult;
      return repo.refreshIndex();
    })
    .then((index) => {
      const isStaged = false;

      let promises = [];
      filesArr.forEach( (file, index) => {
        promises.push(repo.stageLines(file.path,file.lines,isStaged));
      });
      return Promise.all(promises);
    })
    //until here, all entries were added to the index and an index tree was written
    //from here, the new commit is generated using the index tree
    .then( () => {
      return gitFunctions.createCommit(this.props.repo.path, commitMsg);
    })
    .catch( (err) => {
      console.log('err:',err);
    })
    .done(function(commitId) {
      console.log('Commit Hash:'+commitId);
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

      if(linesArr.length !== 0) {
        filesArr.push({lines: linesArr, path: diffFile.path.old});
      }
    });

    this.createCommit(filesArr, commitMsg);
  }

  render = () => {

    const styles = {
      main: {
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        border: '4px solid'+constStyles.blue,
        borderLeft: '2px solid'+constStyles.blue,
      },
      commitmsg: {
        paddingLeft: '5%',
        paddingBottom: 15,
        width: '50%',
      },
      cover: {
        borderBottom: '4px solid'+constStyles.blue,
      },
      title: {
        padding: 10,
        color: constStyles.darkBlue,
        fontFamily: `'Oswald', sans-serif`,
        fontSize: 16,
      },
      diff: {
        overflow: 'auto'
      },
      diffProps: {
        type: {
          color: constStyles.darkBlue,
        },
        file: {
          color: constStyles.darkBlue
        },
        border: {
          color: constStyles.darkBlue
        }
      }
    };

    return (
      <div style={styles.main} >
        <div style={styles.title} >
          Selective Staging: Stage individual lines/hunk (modified files only)
        </div>
        <div style={styles.cover}>
          <div style={styles.commitmsg} >
            <CommitMessage buttonMsg='Commit selected lines!' commitCB={this.collectCheckedLines} />
          </div>
        </div>
        <div style={styles.diff}>
          <DiffPanel
          {...this.props}
          showSelect={true}
          ref={(ref) => this.diffPanel = ref}
          diffStyle={styles.diffProps} />
        </div>
      </div>
    );
  }
}

export default StageSelective;