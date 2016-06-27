import React from 'react';

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

  render = () => {

    let children = React.Children.map( this.props.children, child => {

        return React.cloneElement(child, {
          repo: this.props.repo,
        });
    });

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
        <div style={styles.tabs} >
          {children || <CommitTree repo={this.props.repo} />}
        </div>
      </div>
    );
  }
}

export default RepoOps;