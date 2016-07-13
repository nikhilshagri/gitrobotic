import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import CircleIcon from 'material-ui/svg-icons/av/fiber-manual-record';

import DiffPanel from './utils/DiffPanel';

import Git from 'nodegit';

var url = require("file!./static/branchIcon.svg");


class gitFunctions {

  static getCommits(repoPath, sha, that) {

    let pathToRepo = require('path').resolve(repoPath);
    Git.Repository.open(pathToRepo)
    .then(function(repo) {
      return repo.getCommit(sha);
    })
    .then(function( commit ) {
      let history = commit.history( Git.Revwalk.SORT.Time);
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

    return Git.Repository.open(require('path').resolve(path))
    .then(function(repo) {
      return repo.getCommit(sha);
    })
    .then(function(commit) {
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
        fontWeight: 500,
      },
      commitDiv: {
        display: 'flex',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontFamily: '"Roboto", sans-serif',
        padding: 1,
        margin: 1,
        backgroundColor: '#f1efef',
        borderBottom: '2px inset #d8d8d8',
      },
      circleIcon: {
        minWidth: 13,
        maxWidth: 13,
        minHeight: 13,
        maxHeight: 13,
      },
      message: {
        fontFamily: `apple-system,
          BlinkMacSystemFont,"Segoe UI",
          Roboto,Helvetica,Arial,sans-serif,
          "Apple Color Emoji","Segoe UI Emoji",
          "Segoe UI Symbol"`,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        padding: 2,
        margin: 4,
        fontSize: 15,
      },
      sha: {
        fontSize: 12,
        fontFamily: 'monospace',
      },
      sideBar: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
      },
      line: {
        position: 'absolute',
        left: '42%',
        width: 2,
        height: 80,
        backgroundColor: '#a9a7a7',
      }
    };
    const commit = this.props.commit;

    return (
      <div style={styles.commitDiv} onClick={() => { this.handleOnClick(commit) }} >
        <div style={styles.sideBar}>
          <div style={styles.line} />
          <CircleIcon style={styles.circleIcon} color='#c1c1c1'/>
        </div>
        <div style={styles.message} >
          <p style={{margin: 4}}>{commit.author}</p>
          <span style={styles.sha}>{commit.sha.slice(0, 8)+'  '}</span>
          <span style={styles.span}>{commit.message}</span>
        </div>
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
  constructor(props) {
    super(props);
    this.state = {
      commits: [],
      diffs: [],
      selected_commit: '',
    };
    this.getCommitDiff = this.getCommitDiff.bind(this);
  }

  getCommitDiff = (commit) => {

    //for CommitInfo component
    this.setState({
      selected_commit: commit,
    });

    gitFunctions.getCommitDiff(commit.sha, this.props.repo.path)
    .done((diffList) => {
        this.setState({
          diffs: diffList,
        });
    });
  }

  returnRepo = (commits) => {
    this.setState({
      commits : commits
    });
  }

  componentDidMount = () => {
    if(this.props.repo && this.props.branchRef.sha)
    {
      gitFunctions.getCommits(this.props.repo.path, this.props.branchRef.sha, this);
    }
  }

  componentWillReceiveProps = (newprops) => {
    if(newprops.repo && newprops.branchRef.sha)
    {
      gitFunctions.getCommits(newprops.repo.path, newprops.branchRef.sha, this);
    }
  }
  render() {

    const styles={
      commits: {
        border: '2px solid #d8d8d8',
        borderRadius: '0px 0px 4px 4px',
        overflow: 'auto',
        height: 350,
      },
      branchName: {
        display: 'flex',
        fontFamily: `apple-system,
          BlinkMacSystemFont,"Segoe UI",
          Roboto,Helvetica,Arial,sans-serif,
          "Apple Color Emoji","Segoe UI Emoji",
          "Segoe UI Symbol"`,
        fontWeight: 500,
        fontSize: 20,
        backgroundColor: '#f1efef',
        border: '2px solid #d8d8d8',
        borderBottom: 0,
        margin: 0,
        padding: 20,
      },
    };

    let rows=[];
    this.state.commits.forEach((commit, index) => {
      rows.push(<Commit getCommitDiff={this.getCommitDiff} commit={commit} key={index} />);
    });
    return (
      <div style={{display: 'flex'}} >
        <div style={{width: '35%'}}>
          <div style={styles.branchName}>
            <img style={{width: 15, height: 24}} src={url}></img>
            <div style={{width: 10}} />
            <div style={{height: 24, color: '#6a6a6a'}}>{' '+this.props.branchRef.name}</div>
          </div>
          <div style={styles.commits}>
            { rows }
          </div>
        </div>
        <div style={{width: '65%', height: 500, overflow: 'auto'}}>
          <CommitInfo commit={this.state.selected_commit} />
          <DiffPanel diffs={this.state.diffs} />
        </div>
      </div>
    )
  }
}

export default CommitTree;