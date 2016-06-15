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
import {Tabs, Tab} from 'material-ui/Tabs';

import CommitTree from './CommitTreePanel';
import StagingArea from './StagingAreaPanel';
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
      tabValue: 'CommitTree' ,
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

  handleTabChange = (value) => {
    this.setState({
      tabValue: value
    });
  }

  handleKeyPressChange = (passedPath) => {
    }

    }
  }

  }

  }

    this.setState({
    });
  }

  componentWillMount = () => {
    injectTapEventPlugin();
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
      },
      tabs: {
    };


    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div style={styles.mainPanel} >


            <Tabs style={styles.tabs} value={this.state.tabValue}  onChange={this.handleTabChange} >

              <Tab label="Commits" value="CommitTree" >
                <CommitTree repo={renderRepo} />
              </Tab>

              <Tab label="Staging Area" value="StagingArea" >
                <StagingArea repo={renderRepo} />
              </Tab>

            </Tabs>
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
