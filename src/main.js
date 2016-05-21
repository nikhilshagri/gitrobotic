import React from 'react';
import ReactDOM from 'react-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';

import Git from 'nodegit';

// var pathToRepo = require('path').resolve('../js-reporters');


var getCommits = function(pathToRepo) {

  pathToRepo = require('path').resolve(pathToRepo);
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

      this.setCommitsState(commits);
  }).bind(this);

}

const darkMuiTheme = getMuiTheme(darkBaseTheme);
const style= {
  margin:12,
};

class Commit extends React.Component {
  render() {
    var commit = this.props.commit;
    return (
      <div>
        <Card >
          <CardHeader subtitle={commit.sha} />
          <CardTitle title={commit.author} subtitle={commit.email} />
          <CardTitle subtitle={commit.date} />
          <CardText>
            {commit.message}
          </CardText>
        </Card>
        <br />
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

  sendQuery() {
    this.props.onKeyPress(this.state.value);
  }

  render() {
    return (
      <div>
        <input type="text" placeholder="Enter Repo name here..." ref="textField" value={this.state.value} onChange={this.updateValue} />
        <RaisedButton label="Get Commits!" style={style} onMouseDown={this.sendQuery} />
      </div>
    )
  }
}

class CommitTable extends React.Component {
  render() {
    var rows=[];
    this.props.commits.forEach(function(commit, index) {
      rows.push(<Commit commit={commit} key={index} />);
    });
    return (
    <div>{ rows }</div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { pathToRepo:'' , commits: [] };
    this.handleKeyPressChange = this.handleKeyPressChange.bind(this);
  }

  handleKeyPressChange(passedPath)
  {
    (getCommits.bind(this))(passedPath);
  }

  setCommitsState(commits)
  {
    this.setState( { commits: commits });
    console.log(this.state.commits);
  }

  render() {

    return (
      <MuiThemeProvider muiTheme={darkMuiTheme}>
        <div>
          <SearchBar pathToRepo={this.state.pathToRepo} onKeyPress={this.handleKeyPressChange} />  
          <CommitTable commits={this.state.commits} />
        </div>
      </MuiThemeProvider>
    )
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
