import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

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
}

class Commit extends React.Component {
  render() {
    var commit = this.props.commit;
    return (
      <div >
        <Card style={ {margin:5} } >
          <CardHeader title={commit.author} subtitle={commit.message}
          actAsExpander={true} 
          showExpandableButton={true} />
          <CardText  expandable={true} >
            <p>{commit.email}</p>
            <p>{commit.sha}</p>
            <p>{commit.date}</p>
          </CardText>
        </Card>
      </div>
    )
  }
}

class CommitTree extends React.Component {
  render() {

    const style={
      border:'1px solid black', 
      overflow: 'auto', 
      width: '100%' 
    };

    let rows=[];
    this.props.commits.forEach(function(commit, index) {
      rows.push(<Commit commit={commit} key={index} />);
    });
    return (
      <div style={style}>{ rows }</div>
    )
  }
}

export default CommitTree;