import React from 'react';
import { Link } from 'react-router'

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
import CommitTree from './CommitTreePanel';
import StagingArea from './StagingAreaPanel';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
import injectTapEventPlugin from 'react-tap-event-plugin';

import Git from 'nodegit';

const darkMuiTheme = getMuiTheme(darkBaseTheme);

const constStyles = {
  fontFamily: `apple-system,
          BlinkMacSystemFont,"Segoe UI",
          Roboto,Helvetica,Arial,sans-serif,
          "Apple Color Emoji","Segoe UI Emoji",
          "Segoe UI Symbol"`,
  darkRed: '#b60a0a',
};

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
    this.props.changeToolbar(label);
  }

  render = () => {
    const styles = {
      toolbar:{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#EAEAEA',
        padding: 12,
        paddingLeft: '5%',
        border: '2px solid #EAEAEA',
        height: 40,
      },
      button: {
        position: 'relative',
        margin: 35,
        borderRadius: 2,
        marginRight: 5,
        marginLeft: 5,
        fontFamily: constStyles.fontFamily,
        fontSize: 17,
        fontWeight: 600,
        letterSpacing: -1,
        maxWidth: 140,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textTransform: 'uppercase',
        color: '#454545',
        textDecoration: 'none',
        padding: 7,
        backgroundColor: '#ffffff',
      }
    };

    return (
        <div style={styles.toolbar}>
          <Link style={styles.button}
          to='/repo'>
            {'Repos'}
          </Link>

          {this.props.repoName?
          <Link to='/repoOps'
          style={styles.button}>
            {this.props.repoName}
          </Link>
            :<div />}
        </div>
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
    };
  }

  handleKeyPressChange = (passedPath) => {
    //TODO: Check if passed path is valid or not
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
      this.setState({
        currRepoIndex: pos
      });
    }
    else
    {
      //checks if the folder contains a git repo
      let promise = gitFunctions.repoExists(passedPath);
      promise.then( () => {
        let repos = this.state.repos;
        repos.push({
          name: repoName,
          path: passedPath
        });
        let repoIndex = repos.length - 1;

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

  }

  handleRequestClose = () => {
    this.setState({
      openWrongDirSnackBar: false 
    });
  }

  componentWillMount = () => {
    injectTapEventPlugin();
    this.handleKeyPressChange('../dummy-repo');
  }

  componentWillReceiveProps = (newprops) => {
  }

  //for dev prurposes only
  componentDidMount = () => {
  }

  render() {

    const styles = {
      mainPanel: {
        height:500,
        // border: '1px solid blue',
        overflow: 'hidden',
      },
      repos: {
      },
      tabs: {
        overflow: 'hidden', 
        width: '50%',
      },
      font: {
        fontFamily: '"Roboto", sans-serif',
      },
    };

    const wrongDirError = 'Could not find a git repository in the folder. Make sure you have selected the correct folder';

    let renderRepo = this.state.repos[this.state.currRepoIndex]?this.state.repos[this.state.currRepoIndex]:null;

    let children = React.Children.map( this.props.children, child => {
      if(child.type === Repo) {

        return React.cloneElement(child, {
          repos: this.state.repos,
          pathToRepo: renderRepo? renderRepo.path: '',
          selectRepo: this.handleRepoClick,
          onKeyPress: this.handleKeyPressChange,
        });

      }
      else if(child.type === RepoOps) {

        return React.cloneElement(child, {
          repo: renderRepo,
        });

      }
    });

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <div style={{width: '100%'}} >
          <MainToolbar repoName={renderRepo? renderRepo.name: ''} />
          <div style={styles.mainPanel} >
          <Snackbar open={this.state.openWrongDirSnackBar} message={wrongDirError} autoHideDuration={4000}
          style={styles.font} onRequestClose={this.handleRequestClose}/>
          {children || <Repo style={styles.repos} repos={this.state.repos} pathToRepo={renderRepo? renderRepo.path: ''}
            selectRepo={this.handleRepoClick} onKeyPress={this.handleKeyPressChange}/>}
          </div>
        </div>
      </MuiThemeProvider>
    )
  }

}

export default App;