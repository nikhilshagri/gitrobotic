import React from 'react';
import ReactDOM from 'react-dom';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import keycode from 'keycode';
import ActivityArea from './ActivityArea';
import CommitTree from './CommitTreePanel';
import StagingArea from './StagingAreaPanel';
import {Tabs, Tab} from 'material-ui/Tabs';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';


import Git from 'nodegit';

// var pathToRepo = require('path').resolve('../js-reporters');


const getCommitsFromRepo = function(repo) {

  let pathToRepo = require('path').resolve(repo);
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
  const walk = (commitsArr) => {
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

      const newRepo = {
        repoName:repo.slice(3),
        commits: commits
      };

      this.returnRepo(newRepo);
  };

}

const darkMuiTheme = getMuiTheme(darkBaseTheme);

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state={ value:props.pathToRepo };
  }

  updateValue = (event) => {
    this.setState({
      value: event.target.value
    });
  }

  sendQuery = (event) => {
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

class RepoTable extends React.Component {

  constructor(props) {
    super(props);
  }

  handleClick = (i) => {
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
      <div style={this.props.style} >{rows}</div>
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
      repoNames: [],
      tabValue: 'CommitTree' 
    };
  }

  handleTabChange = (value) => {
    this.setState({
      tabValue: value
    });
  }

  handleKeyPressChange = (passedPath) => {
    let repoName = passedPath.slice(3);
    if(this.state.repoNames.indexOf(repoName) == -1) {
      //call to global function
      (getCommitsFromRepo.bind(this))(passedPath);
    }
    else {

    }
  }

  setCurrentCommits = (repo) => {
    this.setState({
      currentRepo: repo.repoName,
      currentRepoCommits: repo.commits
    });
  }

  handleRepoClick = (index) => {
    this.setCurrentCommits(this.state.repos[index]);
  }

  returnRepo = (newRepo) =>
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

  componentWillMount = () => {
    injectTapEventPlugin();
  }

  render() {

    const styles = {
      mainPanel: {
        display: 'flex',
        border: '1px solid black',
        width: '80%',
        height:400
      },
      repos: {
        flexShrink:3,
        width: '100%'
      },
      tabs: {
        border:'1px solid black', 
        overflow: 'auto', 
        width: '100%'
      }
    };


    return (
      <MuiThemeProvider muiTheme={darkMuiTheme}>
        <div>
          <SearchBar pathToRepo={this.state.pathToRepo} onKeyPress={this.handleKeyPressChange} />  
          <div style={styles.mainPanel} >

            <RepoTable style={styles.repos} repos={this.state.repos} selectRepo={this.handleRepoClick} />

            <Tabs style={styles.tabs} value={this.state.tabValue}  onChange={this.handleTabChange} >

              <Tab label="Commits" value="CommitTree" >
                <CommitTree commits={this.state.currentRepoCommits}  />
              </Tab>

              <Tab label="Staging Area" value="StagingArea" >
                <StagingArea />
              </Tab>

            </Tabs>
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
