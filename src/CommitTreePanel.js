import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import SidePanel from './utils/SidePanel';
import CircleIcon from 'material-ui/svg-icons/av/fiber-manual-record';

import DiffPanel from './utils/DiffPanel';

import Git from 'nodegit';


class gitFunctions {

  static getCommits(repoPath,that) {

    let pathToRepo = require('path').resolve(repoPath);
    Git.Repository.open(pathToRepo)
    .then(function(repo) {
      return repo.getMasterCommit();
    })
    .then(function( firstMasterCommit ) {
      let history = firstMasterCommit.history( Git.Revwalk.SORT.Time);
      history.on("end", walk);
      history.start();
    })
    .done();

    //   function passed to history.on() listener to receive commits' info.
    //   calls the setCommitState of App class to set new state
    let walk = (function(commitsArr){
      let commits = [];
        commitsArr.forEach( function(commit) {
          commits.push({
            sha: commit.sha(),
            author: commit.author().name(),
            email: commit.author().email(),
            date: commit.date().toString(),
            message: commit.message()
          });
        });
        //TODO: pass a promise object to the function and can the
        //history event listener from there
        that.returnRepo(commits);
    }).bind(that);

  }

  static getCommitDiff(sha, path) {
    // console.log(sha);
    // console.log(path);
    return Git.Repository.open(require('path').resolve(path))
    .then(function(repo) {
      return repo.getCommit(sha);
    })
    .then(function(commit) {
      // console.log("commit " + commit.sha());
      // console.log("Author:", commit.author().name() +
      //   " <" + commit.author().email() + ">");
      // console.log("Date:", commit.date());
      // console.log("\n    " + commit.message());

      return commit.getDiff();
    });
  }
}

class Commit extends React.Component {
  constructor(props) {
    super(props);
  }

  handleOnClick = (commit) => {

    this.props.getCommitDiff(commit);

    // gitFunctions.getCommitDiff(commit.sha, this.props.repoPath);

  }

  render() {
    const styles={
      span: {
        fontWeight: 900,
      },
      commitDiv: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontFamily: '"Roboto", sans-serif',
        padding: 10,
        margin: 9,
        boxShadow: '2px 2px 2px #888888',
      },
      circleIcon: {
        width: 13,
        height: 13,
      }
    };
    const commit = this.props.commit;

    return (
      <div style={styles.commitDiv} onClick={() => { this.handleOnClick(commit) }} >
        <CircleIcon style={styles.circleIcon} color='red'/>
        <span style={styles.span} >{'   '+commit.author}</span>:
        {commit.message}
      </div>
    )
  }
}





class CommitInfo extends React.Component {

  constructor(props) {
    super(props);
  }

  render = () => {
    let commit = '';
    if(this.props.commit) {
      commit = this.props.commit;
    }

    // console.log(commit);
    const styles= {
      font: {
        fontFamily: '"Roboto", sans-serif',
        fontSize: 15,
      },
    };
    return (
      <div style={{border: '1px solid black' }} >
        <p style={styles.font} ><b>{commit.author}</b></p>
        <p style={styles.font} >{commit.sha}</p>
        <p style={styles.font} >{commit.message}</p>
        <p style={styles.font} >{commit.date}</p>
      </div>
    );
  }
}

class CommitTree extends React.Component {
  render() {

    const style={
      border:'1px solid black', 
      overflow: 'auto', 
      width: '100%' 
      sidePanel: {
        width: '15%',
        border: '1px solid black',
        backgroundColor: 'grey',
        marginRight: 10,
      }
    };

    let rows=[];
    this.props.commits.forEach(function(commit, index) {
      rows.push(<Commit commit={commit} key={index} />);
    });
    return (
      <div style={style}>{ rows }</div>
      <div style={{display: 'flex'}} >
        <div style={styles.sidePanel} >
          <SidePanel {...this.props} />
        </div>
        <div style={{width: '55%'}}>
          <DiffPanel diffs={this.state.diffs} />
        </div>
      </div>
    )
  }
}

export default CommitTree;