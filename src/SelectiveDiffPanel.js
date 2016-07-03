// uses the DiffPanel component to stage selected lines only.
// Sends selected lines upwards to StagingAreaPanel

import React from 'react';

import DiffPanel from './utils/DiffPanel';

class SelectiveDiffPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedLines: [],
    };
  }

  genCheckboxes = () => {

  }

  render = () => {
    const styles = {
      main: {
        display: 'flex',
        flexDirection: 'row',
      }
    };

    return (
      <div style={styles.main} >
        <div></div>
        <DiffPanel {...this.props} />
      </div>
    );
  }
}

export default SelectiveDiffPanel;