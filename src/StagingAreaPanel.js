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