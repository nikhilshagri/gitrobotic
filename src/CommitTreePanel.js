import React from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';


class Commit extends React.Component {
  render() {
    var commit = this.props.commit;
    return (
      <div >
        <Card style={ {margin:5} } >
          <CardHeader title={commit.author} subtitle={commit.message}
          actAsExpander={true} 
          showExpandableButton={true} />
          <CardText  expandable={true} >
            <p>{commit.email}</p>
            <p>{commit.sha}</p>
            <p>{commit.date}</p>
          </CardText>
        </Card>
      </div>
    )
  }
}

class CommitTree extends React.Component {
  render() {

    const style={
      border:'1px solid black', 
      overflow: 'auto', 
      width: '100%' 
    };

    let rows=[];
    this.props.commits.forEach(function(commit, index) {
      rows.push(<Commit commit={commit} key={index} />);
    });
    return (
      <div style={style}>{ rows }</div>
    )
  }
}

export default CommitTree;