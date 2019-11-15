import React from 'react';
import Feed from './Feed';
import { setup } from './service';


const App: React.FC = () => {
  setup();
  return (
    <Feed></Feed>
  );
}

export default App;
