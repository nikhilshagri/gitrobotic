import React from 'react';

import DiffPanel from './DiffPanel';
import CommitMessage from './CommitMessage';

class StageSelective extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      commitMsg: '',
    }
  }

  createCommit = (commitMsg) => {
    console.log(commitMsg);
    console.log(this.diffPanel);
  }

  render = () => {
    return (
      <div>
        <CommitMessage buttonMsg='Commit selected lines!' commitCB={this.createCommit} />
        <DiffPanel {...this.props} showSelect={true} ref={(ref) => this.diffPanel = ref} />
      </div>
    );
  }
}

export default StageSelective;