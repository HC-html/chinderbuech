import React from "react";
import Feed from "./Feed";
import { setup } from "./service";
import Hero from "./Hero";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App: React.FC = () => {
  setup();
  return (
    <Router>
      <Hero></Hero>
      <Switch>
        {/* <Route path="/missgebut">
            <Users />
          </Route> */}
        <Route path="/:user">
          <Feed></Feed>
        </Route>
        <Route path="/">
          <Feed></Feed>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
