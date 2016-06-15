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

const darkMuiTheme = getMuiTheme(darkBaseTheme);


  }
}

  constructor(props) {
    super(props);
  }

  }

    };

    return (
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

  //for dev prurposes only
  componentDidMount = () => {
    this.handleKeyPressChange('../git-gui');
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
      },
      tabs: {
        border:'1px solid black', 
        overflow: 'auto', 
        width: '100%'
      }
    };


    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
          <div style={styles.mainPanel} >


            <Tabs style={styles.tabs} value={this.state.tabValue}  onChange={this.handleTabChange} >

              <Tab label="Commits" value="CommitTree" >
                <CommitTree commits={this.state.currentRepoCommits}  />
              </Tab>

              <Tab label="Staging Area" value="StagingArea" >
                <StagingArea repo={this.state.currentRepo} />
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
