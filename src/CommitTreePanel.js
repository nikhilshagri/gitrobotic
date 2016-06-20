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

//used to render diff of each file
class Diff extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {

    let diffLines = [];
    let posDiffs = [];
    let negDiffs = [];

    let posLineNum;
    let negLineNum;

    let posArr = [];
    let negArr = [];

    this.props.diff.lines.forEach( (line, index) => {

      if(line[0] === '@' || line[1] === '@') {
        //evil hackery to obtain starting line numbers (ok, not really :P)
        let lineWithNums = line.substr(2, line.lastIndexOf('@@') - 2);
        lineWithNums = lineWithNums.trim();
        let arr = lineWithNums.split(' ');
        arr[0] = arr[0].slice(1);
        arr[1] = arr[1].slice(1);
        negArr = arr[0].split(',');
        posArr = arr[1].split(',');
        // console.log(posArr, negArr);
      }

      if(line.trim() !== 'diff' && line.trim() !== this.props.diff.path) {

        let bgColor;
        if(line[0] === '+') {
          bgColor = 'rgba(199, 255, 199, 1)';
          posDiffs.push(<div style={{backgroundColor: bgColor, }} key={index}>
            <code style={{whiteSpace: 'pre'}}>{posArr[0]++}</code>
            </div>);
          negDiffs.push(<div style={{backgroundColor: bgColor, }} key={index}>
            <code style={{whiteSpace: 'pre'}}>{' '}</code>
            </div>);
        }
        else if(line[0] === '-') {
          bgColor = 'rgba(255, 17, 17, 0.3)';
          posDiffs.push(<div style={{backgroundColor: bgColor, }} key={index}>
            <code style={{whiteSpace: 'pre'}}>{' '}</code>
            </div>);
          negDiffs.push(<div style={{backgroundColor: bgColor, }} key={index}>
            <code style={{whiteSpace: 'pre'}}>{negArr[0]++}</code>
            </div>);
        }
        else if(line[0] === '@' || line[1] === '@') {
          bgColor = '#deecff';
          posDiffs.push(<div style={{backgroundColor: bgColor, }} key={index}>
            <code style={{whiteSpace: 'pre'}}>{' '}</code>
            </div>);
          negDiffs.push(<div style={{backgroundColor: bgColor, }} key={index}>
            <code style={{whiteSpace: 'pre'}}>{' '}</code>
            </div>);
        }
        else
        {
          posDiffs.push(<div key={index}>
            <code style={{whiteSpace: 'pre'}}>{posArr[0]++}</code>
            </div>);
          negDiffs.push(<div key={index}>
            <code style={{whiteSpace: 'pre'}}>{negArr[0]++}</code>
            </div>);
        }

        diffLines.push(<div style={{backgroundColor: bgColor,  width: '100%', }} key={index}>
          <code style={{whiteSpace: 'pre', color: '#183691',width: '100%', display: 'inline-block',}} >{line}</code>
          </div>);
      }
    });

    const styles = {
      negPos: {
        border: '1px solid grey', 
        borderRight: '',
        width: 40,
        color: 'rgba(0,0,0,0.3)',
        textAlign: 'center',
      },
    };

    return (
      <div style={{margin: 5, borderRadius: 10}} >
        <code style={{whiteSpace: 'pre', }} >{this.props.diff.path}</code>
        <div style={{display: 'flex', flexDirection: 'row', margin: 5, }} >
          <div style={styles.negPos} >{negDiffs}</div>
          <div style={styles.negPos} >{posDiffs}</div>
          <div style={{border: '1px solid grey', width: '100%', overflow: 'auto'}} >{diffLines}</div>
        </div>
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