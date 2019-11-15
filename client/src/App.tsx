import React from "react";
import Feed from "./Feed";
import { setup } from "./service";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ViewFinder from "./upload/ViewFinder";
const SwipeableRoutes = require("react-swipeable-routes").default;

const App: React.FC = () => {
  setup();
  return (
    <Router>
      <SwipeableRoutes containerStyle={{ height: "100%" }}>
        <Route
          path="/:user?"
          defaultParams={{ user: "" }}
          component={Feed}
        ></Route>
        <Route path="/missgebut" component={ViewFinder}></Route>
      </SwipeableRoutes>
    </Router>
  );
};

export default App;
