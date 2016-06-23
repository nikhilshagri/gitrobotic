import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link } from 'react-router'

import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import keycode from 'keycode';
import {Tabs, Tab} from 'material-ui/Tabs';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Paper from 'material-ui/Paper';
import Snackbar from 'material-ui/Snackbar';

import Repo from './RepoPanel';
import RepoOps from './RepoOps';
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';

import Git from 'nodegit';

const darkMuiTheme = getMuiTheme(darkBaseTheme);

class gitFunctions {
  static repoExists(path) {
    const pathToRepo = require('path').resolve(path);

    return Git.Repository.open(pathToRepo);
  }
}

class MainToolbar extends React.Component {
  constructor(props) {
    super(props);
    this.state={
      toggle: false
    };
  }

  changeToolbar = (label) => {
    // console.log(label);
    this.props.changeToolbar(label);
  }

  render = () => {
    const styles = {
      toolbar:{
        backgroundColor: 'blue',
        paddingLeft: '5%',
        border: '1px solid black',
        // boxShadow: '10px 10px 10px #888888',
        zIndex: 100,
      },
      button: {
        position: 'relative',
        marginRight: 5,
        marginLeft: 5,
        backgroundColor: '#CACACA',
      },
    };
    const repoButton = this.props.repoName?<FlatButton style={styles.button} label={this.props.repoName}
    onMouseDown={this.changeToolbar.bind(this, this.props.repoName)}/>:<div />;

    return (
        <Toolbar style={styles.toolbar} noGutter={false} >
          <ToolbarGroup firstChild={true} > 
            <FlatButton style={styles.button} label='Repos' onMouseDown={this.changeToolbar.bind(this, 'Repos')} />
            {repoButton}
          </ToolbarGroup>
        </Toolbar>
    );
  }
} 

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  
      currRepoIndex: -1, 
      repos: [],
      openWrongDirSnackBar: false,

      dynStyle: {
        repoList: {
          // border: '10px solid black',
          display: 'inline',
          // zIndex: 1
        },
        repoPage: {
          // border: '10px solid red',
          display:'none',
          // zIndex: 0
        }
      }
    };
  }

  handleKeyPressChange = (passedPath) => {
    //TODO: Check if passed path is valid or not
    console.log(passedPath);
    //extracts the name of the repo from the path name
    const repoName = passedPath.slice(passedPath.lastIndexOf('/')+1);
    let flag = false;
    let pos;

    this.state.repos.forEach( (repo, index) => {

      //if repo already exists in the state
      if(repo.path === passedPath) {
        pos = index;
        flag = true;
      }
    });

    if( flag ) {
      // console.log('true');
      this.setState({
        currRepoIndex: pos
      });
    }
    else
    {
      // console.log('false');
      //checks if the folder contains a git repo
      let promise = gitFunctions.repoExists(passedPath);
      promise.then( () => {
        let repos = this.state.repos;
        repos.push({
          name: repoName,
          path: passedPath
        });
        let repoIndex = repos.length - 1;
        // console.log(repoIndex);

        this.setState({
          currRepoIndex: repoIndex,
          repos: repos
        });
        this.changeToolbar(repoName);
      })
      .catch( (failure) => {
        console.log('Could not find a git repository in the folder',
          'Make sure you have selected the correct folder');
        console.log('failure',failure);
        this.setState({
          openWrongDirSnackBar: true
        });
      });
      // console.log(this.state);
    }
  }

  handleRepoClick = (index) => {
    window.setTimeout( () => {
      this.setState({
        currRepoIndex: index
      });
      this.changeToolbar(this.state.repos[index].name);
    },0);
  }

  changeToolbar = (label) => {
    // console.log('in app',label);
    if(label ==='Repos') {
      this.setState({
        dynStyle: {
          repoList: {
            display:'inline',
            // zIndex: 1
          },
          repoPage: {
            display:'none',
            // zIndex: 0
          }
        }
      });
    }
    else
    {
     this.setState({
      dynStyle: {
        repoList: {
          display:'none',
          // zIndex: 1
        },
        repoPage: {
          display:'inline',
          // zIndex: 0
        }
      }
    });     
    }
  }

  handleRequestClose = () => {
    this.setState({
      openWrongDirSnackBar: false 
    });
  }

  componentWillMount = () => {
    injectTapEventPlugin();
  }

  componentWillReceiveProps = (newprops) => {
    // console.log(newprops);
  }

  //for dev prurposes only
  componentDidMount = () => {
    this.handleKeyPressChange('../git-gui');
  }

  render() {

    const styles = {
      mainPanel: {
        height:800
      },
      repos: {
        ...this.state.dynStyle.repoList,
      },
      tabs: {
        ...this.state.dynStyle.repoPage,
        overflow: 'hidden', 
        width: '50%',
      },
      font: {
        fontFamily: '"Roboto", sans-serif',
      },
    };

    const wrongDirError = 'Could not find a git repository in the folder. Make sure you have selected the correct folder';


    // console.log('name',this.state.repos[this.state.currRepoIndex].name);
    let renderRepo = this.state.repos[this.state.currRepoIndex]?this.state.repos[this.state.currRepoIndex]:null;
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div style={{width: '100%'}} >
          <MainToolbar repoName={renderRepo? renderRepo.name: ''} changeToolbar={this.changeToolbar} />
          <div style={styles.mainPanel} >

            <Repo style={styles.repos} repos={this.state.repos} pathToRepo={renderRepo? renderRepo.path: ''}
            selectRepo={this.handleRepoClick} onKeyPress={this.handleKeyPressChange}/>

            <Snackbar open={this.state.openWrongDirSnackBar} message={wrongDirError} autoHideDuration={4000}
              style={styles.font} onRequestClose={this.handleRequestClose}/>

            <RepoOps style={styles.tabs} repo={renderRepo} />
          </div>
        </div>
      </MuiThemeProvider>
    )
  }

}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
