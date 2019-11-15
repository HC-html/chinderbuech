import React from "react";
import Feed from "./Feed";
import { setup } from "./service";
import Hero from "./Hero";

const App: React.FC = () => {
  setup();
  return (
    <>
      <Hero></Hero>
      <Feed></Feed>
    </>
  );
};

export default App;
