import React from "react";
import Feed from "./Feed";
import { setup } from "./service";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import ViewFinder from "./upload/ViewFinder";
import TextEditor from "./upload/TextEditor";
import Location from "./upload/Location";

const App: React.FC = () => {
  setup();
  return (
    <Router>
      <Switch>
        <Redirect exact from="/" to="/livio.brunner"/>
        <Route path="/photo" component={ViewFinder}></Route>
        <Route path="/text" component={TextEditor}></Route>
        <Route path="/location" component={Location}></Route>
        <Route exact path="/:user" component={Feed}></Route>
        <Route
          path="/:user/:date?"
          component={Feed}
        ></Route>
      </Switch>
    </Router>
  );
};

export default App;
