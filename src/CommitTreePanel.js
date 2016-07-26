import React from 'react';

import LinearProgress from 'material-ui/LinearProgress';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import CircleIcon from 'material-ui/svg-icons/av/fiber-manual-record';

import DiffPanel from './utils/DiffPanel';

import Git from 'nodegit';

var url = require("file!./static/branchIcon.svg");

const constStyles = {
  fontFamily: `apple-system,
          BlinkMacSystemFont,"Segoe UI",
          Roboto,Helvetica,Arial,sans-serif,
          "Apple Color Emoji","Segoe UI Emoji",
          "Segoe UI Symbol"`,
  darkRed: '#b60a0a',
  grey: '#ededed',
  borderGrey: '#7e7e7e',
  yellow: '#b97005',
};

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
        margin: 0,
        backgroundColor: '#fff6dc',
        borderBottom: '2px solid #ffffff',
        color: constStyles.yellow,
      },
      circleIcon: {
        minWidth: 13,
        maxWidth: 13,
        minHeight: 13,
        maxHeight: 13,
      },
      message: {
        fontFamily: constStyles.fontFamily,
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
        height: 90,
        backgroundColor: constStyles.yellow,
      }
    };
    const commit = this.props.commit;

    return (
      <div style={styles.commitDiv} onClick={() => { this.handleOnClick(commit) }} >
        <div style={styles.sideBar}>
          <div style={styles.line} />
          <CircleIcon style={styles.circleIcon} color={constStyles.yellow}/>
        </div>
        <div style={styles.message} >
          <p style={{margin: 4}}>{commit.author}</p>
          {commit.sha?<span style={styles.sha}>{commit.sha.slice(0, 8)+'  '}</span>:null}
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
      main: {
        backgroundColor: '#fffdf8',
        fontFamily: constStyles.fontFamily,
        fontSize: 15,
        border: '2px solid'+ constStyles.yellow,
        borderBottom: '1px solid'+ constStyles.yellow,
        letterSpacing: -1,
      },
      margin: {
        margin: 10,
      },
      author: {
        margin: 7,
        fontSize: 32,
        fontWeight: 700,
        color: constStyles.yellow,
      },
      message: {
        color: constStyles.yellow,
        fontSize: 20,
      },
      dateSha: {
        color: constStyles.yellow,
        fontSize: 15,
      }
    };
    return (
      <div style={styles.main} >
        <div style={styles.margin} >
          <p style={styles.author} >{commit.author}</p>
          <p style={styles.message} >{commit.message}</p>
          <p style={styles.dateSha}>
            {commit.sha?
              <span style={{fontFamily: 'monospace', fontWeight: 700}} >{commit.sha.slice(0, 8)}</span>
              :null}
            <span >{' '+commit.date}</span>
          </p>
        </div>
      </div>
    );
  }
}

class LoadingCommitInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {

    const styles={
      main:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '65%',
        border: '2px solid'+ constStyles.yellow,
        color: constStyles.yellow,
        fontFamily: constStyles.fontFamily,
        fontSize: 40,
        fontWeight: 800,
        letterSpacing: -2,
      },
      progressBar: {
        marginTop: 15,
        width: 200
      }
    };

    return (
      <div style={styles.main} >
        Loading. Hang Tight!
        <LinearProgress
        color={constStyles.yellow}
        style={styles.progressBar}
        mode="indeterminate" />
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
      selected_commit: null,
    };
    this.getCommitDiff = this.getCommitDiff.bind(this);
  }

  getCommitDiff = (commit) => {

    //for CommitInfo component
    this.setState({
      selected_commit: commit
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
    // to load the first commit's diff info by default
    this.getCommitDiff(commits[0]);
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
      this.setState({
        selected_commit: null
      });
      gitFunctions.getCommits(newprops.repo.path, newprops.branchRef.sha, this);
    }
  }
  render() {

    const styles={
      commits: {
        border: '2px solid'+ constStyles.yellow,
        borderTop: '0px',
        borderRadius: '0px 0px 4px 4px',
        overflow: 'auto',
        height: 350,
      },
      branchName: {
        color: constStyles.yellow,
        display: 'flex',
        fontFamily: constStyles.fontFamily,
        fontWeight: 500,
        fontSize: 20,
        backgroundColor: '#fff6dc',
        border: '2px solid'+ constStyles.yellow,
        borderBottom: '1px solid'+ constStyles.yellow,
        zIndex: 10,
        margin: 0,
        padding: 20,
      },
      diffProps: {
        type: {
          color: constStyles.yellow,
        },
        file: {
          color: constStyles.yellow,
        },
        border: {
          color: constStyles.yellow,
        }
      }
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
            <div style={{height: 24,}}>{' '+this.props.branchRef.name}</div>
          </div>
          <div style={styles.commits}>
            { rows }
          </div>
        </div>
        {this.state.selected_commit?
          <div style={{width: '65%', height: 500, overflow: 'auto'}}>
            <CommitInfo commit={this.state.selected_commit} />
            <div style={{overflow: 'scroll', border: '2px solid'+constStyles.yellow}}>
              <DiffPanel diffs={this.state.diffs} diffStyle={styles.diffProps} />
            </div>
          </div>:
          <LoadingCommitInfo />}
      </div>
    )
  }
}

export default CommitTree;