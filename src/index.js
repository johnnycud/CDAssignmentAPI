import React from 'react';
import ReactDOM from 'react-dom';
import PlayersApp from './components/App';
import './css/App.css';
//import '../node_modules/bootstrap/dist/css/bootstrap.css';
import { run } from "react-server-cli"


ReactDOM.render(
  <PlayersApp />,
  document.getElementById('root')
);

