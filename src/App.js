import s from './style/App.module.sass';
import Header from "./components/Header.js";
import { TimeProgressCards, ProgressBar} from "./components/Progress";

import {
  Switch,
  Route,
  Link
} from "react-router-dom";
import Card from './components/Card';
import { Clock } from './components/Clock';
import { DiaryForm } from './components/Diary';

function App() {
  return (
    <>
      <Header title="TIME"></Header>
      <div className={s.container}> 
        <Switch>
          <Route path="/">
              <TimeProgressCards/>
              <Clock/>
              <DiaryForm/>
          </Route>
        </Switch>
      </div>
    </>
  );
}

export default App;
