import React from "react";
import { Outlet, Link } from "react-router-dom";

import "./App.css";

export const App = () => (
  <div className="App">
    {/* <header className="App-header"> */}
    <nav className="navigation-bar">
      <ul className="navigation-menu">
        <li>
          <Link className="navigation-link" to={`/`}>
            Home
          </Link>
        </li>
        <li>
          <Link className="navigation-link" to={`gallery`}>
            Gallery
          </Link>
        </li>
        <li>
          <Link className="navigation-link" to={`show`}>
            Show
          </Link>
        </li>
      </ul>
    </nav>
    {/* </header> */}
    <div className="App-body">
      <Outlet />
    </div>
  </div>
);

export default App;

// reference: https://medium.com/litslink/how-to-create-google-chrome-extension-using-react-js-5c9e343323ff
// reference: https://github.com/nemrosim/chrome-react-extension-example
