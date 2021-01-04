import s from './style/App.module.sass';
import Header from "./components/Header.js";
import { TimeProgressCards, ProgressBar} from "./components/Progress";

import {
  Switch,
  Route,
  Link
} from "react-router-dom";
import Card from './components/Card';

function App() {
  return (
    <>
      <Header title="LIFE CONTROL"></Header>
      <div className={s.container}> 
        <Switch>
          <Route path="/">
              <TimeProgressCards/>
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default App;
