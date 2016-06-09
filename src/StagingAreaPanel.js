import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';

import Git from 'nodegit';

class gitFunctions {

	static createCommit(repoName, oid) {
		let index;
		let repo;

		repoName = "../"+repoName;

		let pathToRepo = require('path').resolve(repoName);

		return Git.Repository.open(pathToRepo)
			.then(function(repoResult) {
				repo = repoResult;
			  return Git.Reference.nameToId(repo, "HEAD");
			})
			.then(function(head) {
			  return repo.getCommit(head);
			})
			.then(function(parent) {
				const currTimeInSecs = (new Date()).getTime()/1000;
			  let author = Git.Signature.create("Author name",
			    "emailid@domain.com", currTimeInSecs , 0);
			  let committer = Git.Signature.create("Author name",
			    "emailid@domain.com", currTimeInSecs , 0);

			  return repo.createCommit("HEAD", author, committer, "message", oid, [parent]);
			});
	}

	static getStatus(repoName) {

		repoName = "../"+repoName;
		let pathToRepo = require('path').resolve(repoName);

		return Git.Repository.open(pathToRepo);
	}

	static getIndex(repoName) {

		let repo;
		repoName = "../"+repoName;
		let pathToRepo = require('path').resolve(repoName);

		return Git.Repository.open(pathToRepo)
		.then( (repoResult) => {
			repo = repoResult;
		})
		.then(function() {
		  return repo.refreshIndex();
		});

	}
}

class CheckBoxWrapper extends React.Component {
		constructor(props) {
		super(props);
		this.state={
			checked: this.props.checked
		};
	}

	onEventCheck = (event, isInputChecked) => {
		event.stopPropagation();

		this.changeCheckedState(isInputChecked);
	}

	changeCheckedState = (isInputChecked) => {

		window.setTimeout( () => {
			this.setState({
				checked: isInputChecked? true : false
			});
		}, 0);

		// this.props.onChangeSelected(this.props.uniqueId, isInputChecked );
	}

	componentWillReceiveProps = (newprops) => {
	}

	render = () => {
		const styles={
		  checkbox: {
		    marginBottom: 3
		  }
  	};

		return(
			<div>
				<Checkbox style={styles.checkbox} label={this.props.label} 
				value={this.props.value} onCheck={this.onEventCheck} checked={this.state.checked} />
			</div>
		)
	}
}

class ChangesList extends React.Component {
	constructor(props) {
		super(props);
		//contains refs to all the CheckBoxWrapper components
		this.checkboxRefs= [];
	}

	toggleWrapperState = () => {
		this.checkboxRefs.forEach( (ref, index) => {
			if(ref !== null)
				ref.changeCheckedState(this.props.selectAll);
		})
	}

	render = () => {
		let renderStatus;
		if(this.props.statuses.length === 0) {
			renderStatus = <p>No Changes!</p>
		}
		else {
			renderStatus = this.props.statuses.map((status, index) => {
								      return <CheckBoxWrapper key={index} uniqueId={index} label={status.label} 
								      ref={(ref) => this.checkboxRefs[index] = ref}
								      onChangeSelected={this.props.onChangeSelected} checked={this.props.selectAll} value={status.value} />;
				});
		}
		return(
			<div>
				{renderStatus}
			</div>
		)
	}
}
	}
}


class StagingArea extends React.Component {
	constructor(props) {
		super(props);
	}

	static refreshIndex(commitId) {
		console.log('Commit Hash:'+commitId);
	}

	getStatus = () => {
		(globalgetStatus.bind(this))(this.props.repo);
	}

	render = () => {
		return (
			<div>
				<RaisedButton label='Create Commit!' onMouseDown={gitFunctions.refreshIndex.bind(gitFunctions,this.props.repo)} />
				<RaisedButton label='Get status!' onMouseDown={this.getStatus} />
			</div>
		)
	};
}

export default StagingArea;