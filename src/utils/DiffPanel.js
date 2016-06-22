import React from 'react';
import Diff from './Diff';

class DiffPanel extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    // console.log('rendering now!');

    let diffs = [];
    //stores all the diffs in ONE file
    let currDiff = [];
    let currDiffFile = ''; 

    //iterate through all lines while pushing all individual
    //files' diffs into another array of diffs
    this.props.diffs.forEach( (line, index, arr) => {

      let filePath = arr[index + 1];
      if(filePath)
        filePath.trim();

      if(line.trim() === 'diff' && filePath !== currDiffFile) {
        diffs.push({lines: currDiff, path: currDiffFile});
        currDiffFile = filePath;
        currDiff = [];
      }
      else 
        currDiff.push(line);

    });
    //pushing in the last file's diff as well
    diffs.push({lines: currDiff, path: currDiffFile});
    diffs.splice(0, 1);

    let difftree = diffs.map((diff, index) => {
      return (<Diff diff={diff} key={index} />);
    });

    const styles = {
      main: {
        width: '100%',
        border: '1px solid black',
      },
    };
    return(
      <div style={styles.main}>{difftree}</div>
    );
  }
}

export default DiffPanel;