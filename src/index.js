import React from 'react';
import ReactDOM from 'react-dom';
import './index.sass';
import App from './App';
import { EyeProvider } from "./components/EyeOfJudgement";

import {
  BrowserRouter as Router,
} from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <EyeProvider>
        <App />
      </EyeProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
