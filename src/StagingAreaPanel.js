import React from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';

import SelectiveDiffPanel from './SelectiveDiffPanel';

import Git, { Diff } from 'nodegit';

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
      // console.log(repo);
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
        marginBottom: 3
      }
    };

    return(
      <div>
        <Checkbox style={styles.checkbox} label={this.props.label} 
        value={this.props.value} onCheck={this.onEventCheck} checked={this.state.checked} />
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
                      onChangeSelected={this.props.onChangeSelected} checked={this.props.selectAll} value={status.value} />;
        });
    }
    return(
      <div>
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
    // console.log('receive props',this.state.selectAll);
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
        let int = 1;

        if (status.isNew()) { words.push(<span key={int} style={{color:'green'}}>NEW</span>); flag = 1;}
        if (status.isModified()) { words.push(<span key={int} style={{color:'yellow'}}>MODIFIED</span>); flag = 1;}
        if (status.isTypechange()) { words.push(<span key={int} style={{color:'blue'}}>TYPECHANGED</span>); flag = 1;}
        if (status.isRenamed()) { words.push(<span key={int} style={{color:'orange'}}>RENAMED</span>); flag = 1;}
        if (status.isIgnored()) { words.push(<span key={int} style={{color:'red'}}>IGNORED</span>); flag = 1; }
        if(flag == 0) { words.push(<span key={int} style={{color:'red'}}>DELETED</span>); }

        return words;
      };
      
      localStatus = this.state.statuses.map((file, index) => {

        let change=statusToText(file);
        let changes =[];
        changes.push(<span key={0} >{file.path()}</span>);
        changes.push(change);

        return ({
          label:changes,
          value: file.path()
        });

      });
    }

    const styles = {
      root:{
        border: '1px solid black'
      },
      ul:{
        listStyleType: 'none'
      }
    };
    return(
      <div style={styles.root} >
        <p>STATUS</p>
        <Checkbox label='Select All:' ref={(ref) => this.selectAll = ref}  style={{width: 200}}
        onCheck={this.checkSelectAll} checked={this.state.selectAll} labelPosition='left' />
        <ChangesList ref={(ref) => this.changesList = ref} selectAll={this.state.selectAll}
        statuses={localStatus} />
      </div>
    )
  }
}

class IndexTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <div>
        {this.props.indexEntries.map( (entry, index) => {
          return <div key ={index}>{entry}<br /></div>;
        })}
      </div>
    );
  }
}


class StagingArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      indexPaths: [],
      commitMsg: '',
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

    // console.log('index',indexPaths);

    window.setTimeout( () => {

      this.setState({
        indexPaths: indexPaths
      });
      // console.log(this.state.indexPaths);
    }, 0);
  }

  createCommit = () => {

    let index;
    let oid;

    let promise = gitFunctions.getIndex(this.props.repo.path);
    promise = promise.then((indexResult) => {
      index = indexResult;
    });

    let filePaths = this.state.indexPaths.map( (status) => {
      return status.value;
    });

    // console.log(filePaths);

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
      console.log(index.entries());
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
      let innerPromise = gitFunctions.createCommit(this.props.repo.path, oid, this.state.commitMsg);
      innerPromise.done(function(commitId) {
        console.log('Commit Hash:'+commitId);
      });
      
    });
  }

  updateValue = (event) => {
    this.setState({
      commitMsg: event.target.value
    });
  }

  componentDidMount = () => {
    let diffArr = [];
    if(this.props.repo)
      gitFunctions.getUnstagedChanges(this.props.repo.path)
      .done( (diff) => {
        this.setState({
          diffs: [ diff ]
        });
      });
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
        height:350,
        overflow: 'auto',
        display: 'flex',
      },
      createCommit: {
        width: '30%',
        display: 'flex',
        flexDirection: 'column',
      },
      selectiveDiffPanel: {
        width: '69%',
      }
    };
    return (
      <div style={styles.main} >
        <div style={styles.createCommit} >
          <div>
            <RaisedButton label='Create Commit!' onMouseDown={this.createCommit} />
            <RaisedButton label='Add to Index!' onMouseDown={this.addToIndex} />
          </div>
          <TextField
            hintText="Enter commit message..."
            multiLine={true}
            rows={2}
            rowsMax={2}
            value={this.state.commitMsg}
            onChange={this.updateValue} />
            <StatusTable {...this.props} ref={(ref) => this.statusTable = ref} />
            <IndexTable indexEntries={this.state.indexPaths.map( (status) => {return status.label})} />
        </div>
        <div style={styles.selectiveDiffPanel} >
          <SelectiveDiffPanel diffs={this.state.diffs} />
        </div>
      </div>
    )
  }
}

export default StagingArea;
