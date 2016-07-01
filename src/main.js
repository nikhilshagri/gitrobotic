import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, hashHistory } from 'react-router'

import App from './App';
import Repo from './RepoPanel';
import RepoOps from './RepoOps';
import CommitTree from './CommitTreePanel';
import StagingArea from './StagingAreaPanel';

const Routes = (
    <Route path="/" component={App} >
      <Route path='/repo' component={Repo} />

      <Route path='/repoOps' component={RepoOps} >
        <Route path='/repoOps/commitTree' component={CommitTree} />
        <Route path='/repoOps/stagingArea' component={StagingArea} />
      </Route>

    </Route>);

ReactDOM.render(
  <Router history={hashHistory}>
    {Routes}
  </Router>,
  document.getElementById('app')
);
