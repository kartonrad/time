import s from './style/App.module.css';
import Header from "./components/Header.js";

import {
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {
  return (
    <>
      <Header title="LIFE CONTROL"></Header>
      <Switch>
        <Route path="/">
        	  
        </Route>
      </Switch>
    </>
  );
}

export default App;
