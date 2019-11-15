import React from "react";
import Feed from "./Feed";
import { setup } from "./service";
import Hero from "./Hero";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ViewFinder from './upload/ViewFinder';


const App: React.FC = () => {
  setup();
  return (
    <Router>
      <Hero></Hero>
      <Switch>
        <Route path="/missgebut">
            <ViewFinder></ViewFinder>
          </Route>
        <Route path="/">
          <Feed></Feed>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
