import React from "react";
import Feed from "./Feed";
import { setup } from "./service";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ViewFinder from "./upload/ViewFinder";
import TextEditor from "./upload/TextEditor";
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
        <Route path="/text" component={TextEditor}></Route>
      </SwipeableRoutes>
    </Router>
  );
};

export default App;
