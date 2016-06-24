import React from 'react';

import {Tabs, Tab} from 'material-ui/Tabs';

import SidePanel from './utils/SidePanel';
import CommitTree from './CommitTreePanel';
import StagingArea from './StagingAreaPanel';

class RepoOps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 'CommitTree' ,
    };
  }

  handleTabChange = (value) => {
    this.setState({
      tabValue: value
    });
  }

  render = () => {
    const styles = {
      main: {
        display: 'flex',
      },
      sidePanel: {
        width: '20%',
      },
      tabs: {
        overflow: 'hidden',
        width: '80%',
      }
    };

    return (
      <div style={styles.main} >
        <SidePanel {...this.props} styleInherited={styles.sidePanel} />
        <Tabs style={styles.tabs} value={this.state.tabValue}  onChange={this.handleTabChange} >

          <Tab label="Commits" value="CommitTree" >
            <CommitTree repo={this.props.repo} />
          </Tab>

          <Tab label="Staging Area" value="StagingArea" >
            <StagingArea repo={this.props.repo} />
          </Tab>

        </Tabs>
      </div>
    );
  }
}

export default RepoOps;