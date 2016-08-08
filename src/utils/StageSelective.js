import React from 'react';

import DiffPanel from './DiffPanel';
import CommitMessage from './CommitMessage';

import Promise from 'promise';
import Git from 'nodegit';

const gitFunctions = {

  getRepo: (path) => {
    const pathToRepo = require('path').resolve(path);

    return Git.Repository.open(pathToRepo);
  },
  /* TODO: Create a common Gitfunctions object, this function is
           the exact same as in StagingAreaPanel                 */
  createCommit: (repoPath, oid, commitMsg) => {

    let index;
    let repo;
    let pathToRepo = require('path').resolve(repoPath);
    return Git.Repository.open(pathToRepo)
      .then(function(repoResult) {
        repo = repoResult;
        return Git.Reference.nameToId(repo, "HEAD");
      })
      .then(function(head) {
        return repo.getCommit(head);
      })
      .then(function(parent) {
        const currTimeInSecs = (new Date()).getTime()/1000;
        // TODO: Replace author and committer name with a name which
        // the user chooses
        let author = Git.Signature.create("Author name",
          "emailid@domain.com", currTimeInSecs , 0);
        let committer = Git.Signature.create("Author name",
          "emailid@domain.com", currTimeInSecs , 0);

        return repo.createCommit("HEAD", author, committer, commitMsg, oid, [parent]);
      });
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

    let repo;
    let oid;
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
    .then(() => {
      return repo.refreshIndex();
    })
    .then((updatedIndex) => {
      return updatedIndex.writeTree();
    })
    .then(function(oidResult) {
      oid = oidResult;
    })
    //until here, all entries were added to the index and an index tree was written
    //from here, the new commit is generated using the index tree
    .then( () => {
      let innerPromise = gitFunctions.createCommit(this.props.repo.path, oid, commitMsg);
      innerPromise.done(function(commitId) {
        console.log('Commit Hash:'+commitId);
      });
    })
    .catch( (err) => {
      console.log('err:',err);
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