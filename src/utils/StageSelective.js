import React from 'react';

import DiffPanel from './DiffPanel';

class StageSelective extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <div>
        testDiv
        <DiffPanel {...this.props} showSelect={true} />
      </div>
    );
  }
}

export default StageSelective;