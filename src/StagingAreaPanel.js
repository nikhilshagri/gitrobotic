import React from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';

import StageSelective from './utils/StageSelective';
import CommitMessage from './utils/CommitMessage';

import * as fs from 'fs';
// to watch over files and reload diffPanel when any changes occur
import watch from 'watch';
import Git, { Diff } from 'nodegit';

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

class gitFunctions {

  static createCommit(repoPath, oid, commitMsg) {
    let index;
    let repo;

    // repoName = "../"+repoName;

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
        let author = Git.Signature.create("Author name",
          "emailid@domain.com", currTimeInSecs , 0);
        let committer = Git.Signature.create("Author name",
          "emailid@domain.com", currTimeInSecs , 0);

        return repo.createCommit("HEAD", author, committer, commitMsg, oid, [parent]);
      });
  }

  static getStatus(repoPath) {

    let pathToRepo = require('path').resolve(repoPath);

    return Git.Repository.open(pathToRepo);
  }

  static getIndex(repoPath) {

    let repo;
    let pathToRepo = require('path').resolve(repoPath);

    return Git.Repository.open(pathToRepo)
    .then( (repoResult) => {
      repo = repoResult;
    })
    .then(function() {
      return repo.refreshIndex();
    });

  }

  static getUnstagedChanges(repoPath) {

    const pathToRepo = require('path').resolve(repoPath);

    return Git.Repository.open(pathToRepo)
    .then( (repo) => {
      return Diff.indexToWorkdir(repo, null, {
      flags: Diff.OPTION.SHOW_UNTRACKED_CONTENT |
             Diff.OPTION.RECURSE_UNTRACKED_DIRS
      });
    });
  }
}

class CheckBoxWrapper extends React.Component {
    constructor(props) {
    super(props);
    this.state={
      checked: this.props.checked
    };
  }

  onEventCheck = (event, isInputChecked) => {
    event.stopPropagation();

    this.changeCheckedState(isInputChecked);
  }

  changeCheckedState = (isInputChecked) => {

    window.setTimeout( () => {
      this.setState({
        checked: isInputChecked? true : false
      });
    }, 0);

    // this.props.onChangeSelected(this.props.uniqueId, isInputChecked );
  }

  componentWillReceiveProps = (newprops) => {
  }

  render = () => {
    const styles={
      checkbox: {
        marginBottom: 6,
      },
      label: {
        color: constStyles.darkBlue,
        fontFamily: constStyles.fontFamily,
        fontSize: 15,
        width: '100%',
      }
    };

    return(
      <div>
        <Checkbox style={styles.checkbox} label={this.props.label} labelStyle={styles.label}
         onCheck={this.onEventCheck} checked={this.state.checked} />
      </div>
    )
  }
}

class ChangesList extends React.Component {
  constructor(props) {
    super(props);
    //contains refs to all the CheckBoxWrapper components
    this.checkboxRefs= [];
  }

  toggleWrapperState = () => {
    this.checkboxRefs.forEach( (ref, index) => {
      if(ref !== null)
        ref.changeCheckedState(this.props.selectAll);
    })
  }

  render = () => {
    let renderStatus;
    if(this.props.statuses.length === 0) {
      renderStatus = <p>No Changes!</p>
    }
    else {
      renderStatus = this.props.statuses.map((status, index) => {
                      return <CheckBoxWrapper key={index} uniqueId={index} label={status.label} 
                      ref={(ref) => this.checkboxRefs[index] = ref}
                      onChangeSelected={this.props.onChangeSelected} checked={this.props.selectAll} />;
        });
    }

    const styles = {
      main: {
        width: '85%',
        paddingLeft: '5%',
        paddingRight: '10%'
      }
    };
    return(
      <div style={styles.main}>
        {renderStatus}
      </div>
    )
  }
}

class StatusTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statuses: [],
      selectAll: true
    };
  }

  getStatus = (repo) => {
    let promise = gitFunctions.getStatus(repo);
    promise.then(function(repo) {
      repo.getStatus().then(function(status) {
        return status;
      })
      .done(function(statuses) {
        this.setState({
          statuses:statuses
        });
      }.bind(this));
    }.bind(this));
  }

  checkSelectAll = (event, isInputChecked) => {

    event.stopPropagation();

    window.setTimeout( () => {
      this.setState({
        selectAll: isInputChecked? true : false
      });

      //reaches into the changesList component, which 
      //in turn reaches into individual CheckBoxWrapper components
      //and sets state accordingly
      this.changesList.toggleWrapperState(this.state.selectAll);
    }, 0);

  }

  componentWillReceiveProps = (newprops) => {
      this.getStatus(newprops.repo.path);
  }

  render = () => {
    let localStatus = [];
    if(this.state.statuses.length === 0)
    {
      localStatus = [];
    }
    else {

      const statusToText=function(status) {
        let words=[];
        let flag = 0;
        let key = 0;

        if (status.isNew()) { words.push(<span key={key} style={{color:'green'}}>N</span>); flag = 1;}
        if (status.isModified()) { words.push(<span key={key} style={{color:'blue'}}>M</span>); flag = 1;}
        if (status.isTypechange()) { words.push(<span key={key} style={{color:'yellow'}}>TYPECHANGED</span>); flag = 1;}
        if (status.isRenamed()) { words.push(<span key={key} style={{color:'orange'}}>RENAMED</span>); flag = 1;}
        if (status.isIgnored()) { words.push(<span key={key} style={{color:'red'}}>IGNORED</span>); flag = 1; }
        if(flag == 0) { words.push(<span key={key} style={{color:'red'}}>D</span>); }

        return words;
      };
      
      localStatus = this.state.statuses.map((file, index) => {

        let change=statusToText(file);

        const styles = {
          main: {
            display: 'flex',
            justifyContent: 'space-between',
          },
          path: {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '90%',
          }
        };

        let changes = (
          <div key={index} style={styles.main}>
            <div style={styles.path}>{file.path()}</div>
            <div style={{textAlign:'right'}}>{change}</div>
          </div>
        );

        return ({
          label:changes
        });

      });
    }

    const styles = {
      main:{
        width: '100%',
        border: '2px solid'+constStyles.blue,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        borderLeft: '0px',
        fontFamily: constStyles.fontFamily,
        color: constStyles.darkBlue,
      },
      status: {
        height: 50,
        backgroundColor: constStyles.blue,
        color:  constStyles.darkBlue,
        display: 'flex',
        paddingLeft: '7%',
        alignItems: 'center',
        fontWeight: 700,
      },
      labelStyle: {
        fontFamily: constStyles.fontFamily,
        color:constStyles.darkBlue,
      },
      checkBox: {
        border: '2px solid'+constStyles.blue,
        margin: 5,
        marginTop: 13,
        marginBottom: 13,
        width: '95%',
      },
      checkBoxes: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flexStart',
        alignItems: 'center',
      }
    };
    return(
      <div style={styles.main} >
        <div style={styles.status} >STATUS</div>
        <div style={styles.checkBoxes} >
          <Checkbox label='Select All:'
          labelStyle={styles.labelStyle}
          ref={(ref) => this.selectAll = ref} style={styles.checkBox}
          onCheck={this.checkSelectAll} checked={this.state.selectAll} labelPosition='left' />
          <ChangesList ref={(ref) => this.changesList = ref} selectAll={this.state.selectAll}
          statuses={localStatus} />
        </div>
      </div>
    )
  }
}

class IndexTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    const styles = {
      main: {
        fontFamily: constStyles.fontFamily,
        color: constStyles.darkBlue,
        padding: '4%',
        paddingTop: '3%',
        paddingRight: '10%',
        borderTop: '2px solid'+constStyles.blue,
      },
      file: {
        padding: 4,
        fontSize: 14,
      },
      heading: {
        fontFamily: `'Oswald', sans-serif`,
        letterSpacing: 0,
        fontSize: 16,
        paddingBottom: 5,
      }
    }
    return (
      <div>
      {this.props.indexEntries.length?
        <div style={styles.main}>
          <div style={styles.heading}>Staged Files:</div>
          {this.props.indexEntries.map( (entry, index) => {
            return <div style={styles.file} key ={index}>{entry}</div>;
          })}
        </div>:
      null}
      </div>
    );
  }
}


class StagingArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indexPaths: [],
      diffs: [],
    };
  }

  addToIndex = () => {

    let checkedChanges = [];
    //reaches into each checkboxWrapper to obtain checked value
    checkedChanges = this.statusTable.changesList.checkboxRefs.map( (ref, index) => {
      if(ref !== null)
        return ref.state.checked;
    });

    let indexPaths =[];

    this.statusTable.changesList.props.statuses.forEach( (status, index) => {

      //if corresponding checkbox has been checked only
      if(checkedChanges[index])
        indexPaths.push(status);
    });

    window.setTimeout( () => {

      this.setState({
        indexPaths: indexPaths
      });
    }, 0);
  }

  createCommit = (commitMsg) => {

    let index;
    let oid;

    let promise = gitFunctions.getIndex(this.props.repo.path);
    promise = promise.then((indexResult) => {
      index = indexResult;
    });

    let filePaths = this.state.indexPaths.map( (status) => {
      return status.value;
    });


    //takes in initial promise, uses it to chain a new promise to it, and returns the promise,
    //which is used in the next iteration
    promise = filePaths.reduce( (prevPromise, path, currentIndex) => {
                return prevPromise.then( () => {
                  return index.addByPath(path);
                });
              }, promise);

    promise.then(() => {
      return index.write();
    })
    .then(() => {
      return index.writeTree();
    })
    .then( (oidResult) => {
      oid = oidResult;
      console.log('index tree written!');
    })
    //until here, all entries were added to the index and an index tree was written
    //from here, the new commit is generated using the index tree
    .then( () => {
      let innerPromise = gitFunctions.createCommit(this.props.repo.path, oid, commitMsg);
      innerPromise.done(function(commitId) {
        console.log('Commit Hash:'+commitId);
      });
      
    });
  }

  setupWatchActions = () => {

    const path = this.props.repo.path;

    fs.readFile(require('path').resolve(path+'/asd', '.gitignore'), (err, data) => {
      if (err) {
        // no .gitignore file found, assume that all files
        // are being tracked by git
        return;
      }
      console.log(data.toString().split('\n'));
    });
  }

  componentDidMount = () => {
    let diffArr = [];
    if(this.props.repo) {
      gitFunctions.getUnstagedChanges(this.props.repo.path)
      .done( (diff) => {
        this.setState({
          diffs: [ diff ]
        });
      });

      this.setupWatchActions();
    }

  }

  componentWillReceiveProps = (newprops) => {
    let diffArr = [];
    if(newprops.repo)
      gitFunctions.getUnstagedChanges(newprops.repo.path)
      .done( (diff) => {
        this.setState({
          diffs: [ diff ]
        });
      });
  }

  render = () => {
    const styles = {
      main: {
        overflow: 'auto',
        display: 'flex',
      },
      createCommit: {
        overflow: 'auto',
        width: '30%',
        display: 'flex',
        flexDirection: 'column',
        color: constStyles.blue,
        border: '2px solid'+constStyles.blue,
      },
      selectiveDiffPanel: {
        width: '69%',
        height: 500,
        overflow: 'auto',
      },
      commitmsg: {
        borderTop: '2px solid'+constStyles.blue,
        borderBottom: '2px solid'+constStyles.blue,
      }
    };
    return (
      <div style={styles.main} >
        <div style={styles.createCommit} >
          <div>
            <StatusTable {...this.props} ref={(ref) => this.statusTable = ref} />
            <RaisedButton
            style={{width: '100%'}}
            label='Add to Index!'
            labelColor={constStyles.darkBlue} onMouseDown={this.addToIndex} />
            <IndexTable indexEntries={this.state.indexPaths.map( (status) => {return status.label})} />
          </div>
          <div style={styles.commitmsg} >
            <CommitMessage buttonMsg='Create Commit!' commitCB={this.createCommit} />
          </div>
        </div>
        <div style={styles.selectiveDiffPanel} >
          <StageSelective diffs={this.state.diffs} repo={this.props.repo} />
        </div>
      </div>
    )
  }
}

export default StagingArea;
