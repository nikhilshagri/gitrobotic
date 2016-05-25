import React from 'react';
import ReactDOM from 'react-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import keycode from 'keycode'

import Git from 'nodegit';

// var pathToRepo = require('path').resolve('../js-reporters');


var getCommitsFromRepo = function(repo) {

  var pathToRepo = require('path').resolve(repo);
  Git.Repository.open(pathToRepo)
  .then(function(repo) {
    return repo.getMasterCommit();
  })
  .then(function( firstMasterCommit ) {
    var history = firstMasterCommit.history( Git.Revwalk.SORT.Time);
    history.on("end", walk);
    history.start();
  })
  .done();

  //   function passed to history.on() listener to receive commits' info. 
  //   calls the setCommitState of App class to set new state
  var walk = (function(commitsArr) {
    var commits = [];
      commitsArr.forEach( function(commit) {
        commits.push({ 
          sha: commit.sha(), 
          author: commit.author().name(),
          email: commit.author().email(),
          date: commit.date().toString(),
          message: commit.message()
        });
      });

      let newRepo = {
        repoName:repo.slice(3),
        commits: commits
      };

      this.returnRepo(newRepo);
  }).bind(this);

}

const darkMuiTheme = getMuiTheme(darkBaseTheme);


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

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state={ value:props.pathToRepo };
    this.updateValue = this.updateValue.bind(this);
    this.sendQuery = this.sendQuery.bind(this);
  }

  updateValue(event) {
    this.setState({
      value: event.target.value
    });
  }

  sendQuery(event) {
    if(!event.which || (event.which && event.which === 13) )
      this.props.onKeyPress(this.state.value);
  }

  render() {
    const style = {
      margin:10
    };

    return (
      <div style={style} >
        <input type="text" placeholder="Enter Repo name here..." ref="textField" 
        value={this.state.value} onChange={this.updateValue} onKeyDown={this.sendQuery} />
        <RaisedButton label="Get Commits!"  onMouseDown={this.sendQuery} />
      </div>
    )
  }
}


class CommitTable extends React.Component {
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

class RepoTable extends React.Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(i) {
    this.props.selectRepo(i);
  }

  render() {
    const style= {
      margin: 5,
    };

    let rows = [];
    this.props.repos.forEach((function(repo, index) {
        rows.push(
          <Card style={style} key={index} onMouseDown={this.handleClick.bind(this, index)} >
            <CardHeader title={repo.repoName} />
          </Card>
        );
    }).bind(this));
    return (
      <div>{rows}</div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      pathToRepo:'' , 
      currentRepo: '', 
      currentRepoCommits: [],
      repos: [],
      repoNames: [] 
    };
    this.handleKeyPressChange = this.handleKeyPressChange.bind(this);
    this.handleRepoClick = this.handleRepoClick.bind(this);
    this.setCurrentCommits = this.setCurrentCommits.bind(this);
    this.returnRepo = this.returnRepo.bind(this);
  }

  handleKeyPressChange(passedPath)
  {
    let repoName = passedPath.slice(3);
    if(this.state.repoNames.indexOf(repoName) == -1) {
      //call to global function
      (getCommitsFromRepo.bind(this))(passedPath);
    }
    else {

    }
  }

  setCurrentCommits(repo) {
    this.setState({
      currentRepo: repo.repoName,
      currentRepoCommits: repo.commits
    });
  }

  handleRepoClick(index) {
    this.setCurrentCommits(this.state.repos[index]);
  }

  returnRepo(newRepo)
  {
    let repos = this.state.repos;
    let repoNames = this.state.repoNames;
    repos.push(newRepo);
    repoNames.push(newRepo.repoName);
    this.setState({
      repos: repos,
      repoNames: repoNames
    });
    this.setCurrentCommits(newRepo);
  }

  render() {

    const style = {
      display: 'flex',
      border: '1px solid black',
      width:800,
      height:400,
    };

    return (
      <MuiThemeProvider muiTheme={darkMuiTheme}>
        <div>
          <SearchBar pathToRepo={this.state.pathToRepo} onKeyPress={this.handleKeyPressChange} />  
          <div style={style} >
            <RepoTable repos={this.state.repos} selectRepo={this.handleRepoClick} />
            <br />
            <CommitTable commits={this.state.currentRepoCommits}  />
          </div>
        </div>
      </MuiThemeProvider>
    )
  }

}

ReactDOM.render(
  <App  />,
  document.getElementById('app')
);
