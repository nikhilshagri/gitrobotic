import React from 'react';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const constStyles = {
  fontFamily: `apple-system,
          BlinkMacSystemFont,"Segoe UI",
          Roboto,Helvetica,Arial,sans-serif,
          "Apple Color Emoji","Segoe UI Emoji",
          "Segoe UI Symbol"`,
  darkRed: '#b60a0a',
};


class CommitMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textValue: '',
    };
  }

  changeMessage = (event) => {
    this.setState({
      textValue: event.target.value
    });
  }

  callCB = () => {
    this.props.commitCB(this.state.textValue);
  }

  render = () => {
    return (
      <div>
        <TextField
          hintText="Enter commit message..."
          multiLine={true}
          rows={2}
          rowsMax={2}
          onChange={(e) => { this.changeMessage(e)}} />
        <RaisedButton label={this.props.buttonMsg} labelColor={constStyles.darkRed} onMouseDown={this.callCB} />
      </div>
    );
  }
}

export default CommitMessage;