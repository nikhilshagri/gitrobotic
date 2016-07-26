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
  blue: '#9CE8FA',
  darkBlue: '#0C6990'
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

    const styles = {
      main: {
        display: 'flex',
        flexDirection: 'column',
      },
      textarea: {
        color: constStyles.darkBlue,
      }
    };
    return (
      <div style={styles.main} >
        <TextField
          hintText="Enter commit message..."
          multiLine={true}
          rows={2}
          rowsMax={2}
          textareaStyle={styles.textarea}
          onChange={(e) => { this.changeMessage(e)}} />
        <RaisedButton label={this.props.buttonMsg} labelColor={constStyles.darkBlue} onMouseDown={this.callCB} />
      </div>
    );
  }
}

export default CommitMessage;