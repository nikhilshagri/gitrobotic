import React from 'react';

import {Tabs, Tab} from 'material-ui/Tabs';

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
    return (
      <Tabs style={this.props.style} value={this.state.tabValue}  onChange={this.handleTabChange} >

        <Tab label="Commits" value="CommitTree" >
          <CommitTree repo={this.props.repo} />
        </Tab>

        <Tab label="Staging Area" value="StagingArea" >
          <StagingArea repo={this.props.repo} />
        </Tab>

      </Tabs>
    );
  }
}

export default RepoOps;