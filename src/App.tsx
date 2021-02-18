import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";

import HomePage from "./pages/home";

function App() {
  return (
    <div className="App">
      <Router>
        <header>
          <h1>Expense Report</h1>
        </header>
        <div className="page-content pb-5 d-flex justify-content-center">
        <Route exact path="/" component={HomePage} />
        </div>
        {/* footer */}
        <footer style={{ background: 'black' }} className="page-footer font-small blue text-white">
          <div className="footer-copyright text-center py-3">© 2020 Copyright:
          <a href="https://www.paytm.ca/">Paytm</a>
          </div>
        </footer>
      </Router>

    </div>
  );
}

export default App;
