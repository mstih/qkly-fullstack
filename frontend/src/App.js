import React from "react";
import { HOME } from "./utils/Constants.js";
import HomeView from "./components/HomeView.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: HOME,
    };
  }

  render() {
    return (
      <div id="APP" className="container-fluid m-0 ">
        <div id="menu" className="row">
          <nav className="navbar navbar-expand-lg navbar-dark bg-second pl-4 pr-2 navbar-border">
            <div className="container-fluid">
              <a
                //onClick={() => this.changeView({ currentView: HOME })}
                className="navbar-brand fw-bold fs-4"
                href="#"
              >
                <img
                  src="/assets/images/one.png"
                  alt="logo"
                  className="logo-image"
                ></img>
              </a>

              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span class="navbar-toggler-icon"></span>
              </button>
            </div>
          </nav>
        </div>
        <div id="view" className="row">
          {/* {this.getView(this.state)} */}
          <HomeView />
        </div>
      </div>
    );
  }
}

export default App;
