import React from "react";
import {
  HOME,
  LOGIN,
  SIGNUP,
  ABOUT,
  SEARCH,
  PROFILE,
  SAVED,
} from "./utils/Constants.js";
import Footer from "./components/Footer.jsx";
import HomeView from "./components/HomeView.jsx";
import AboutView from "./components/AboutView.jsx";
import SearchView from "./components/SearchView.jsx";
import LoginView from "./components/LoginView.jsx";
import SignUpView from "./components/SignUpView.jsx";
import SavedView from "./components/SavedView.jsx";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentView: HOME,
      status: {
        success: null,
        message: "",
      },
      user: null,
    };
    // Not sure but passing views does not work otherwise
    this.setView = this.setView.bind(this);
  }

  getView(state) {
    const view = this.state.currentView;
    switch (view) {
      case HOME:
        return <HomeView setView={this.setView} />;
      case ABOUT:
        return <AboutView />;
      case SEARCH:
        return <SearchView user={this.state.user} />;
      case LOGIN:
        return <LoginView getLoginDataFromChild={this.getLogin} />;
      case SIGNUP:
        return <SignUpView />;
      case SAVED:
        return <SavedView />;
      default:
        return <HomeView />;
    }
  }

  setView(obj) {
    this.setState({
      status: { success: null, message: "" },
      currentView: obj.view,
    });
    console.log("View set to: " + this.state.currentView);
  }

  // Allows the data to be passed from the login component to the app component
  getLogin = (data) => {
    this.setState((this.state.user = data.user));
  };

  render() {
    return (
      <div id="APP" className="d-flex flex-column min-vh-100">
        <div id="menu">
          <nav className="navbar navbar-expand-lg navbar-dark bg-second navbar-border px-3 w-100">
            <div className="container-fluid">
              <a
                onClick={() => this.setView({ view: HOME })}
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

              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                {/* About, search and other links */}
                <ul className="navbar-nav mt-3 mt-lg-0 mb-lg-0 ">
                  <li className="nav-item mb-3 mb-lg-0 ">
                    <a
                      onClick={this.setView.bind(this, { view: ABOUT })}
                      className={`nav-link fs-5 mx-3 p-2 mh-100 ${
                        this.state.currentView === ABOUT
                          ? "greenBorderSmall"
                          : ""
                      }`}
                      href="#"
                    >
                      About
                    </a>
                  </li>
                  <li className="nav-item mb-3 mb-lg-0">
                    <a
                      onClick={this.setView.bind(this, { view: SEARCH })}
                      className={`nav-link fs-5 mx-3 p-2 mh-100 ${
                        this.state.currentView === SEARCH
                          ? "greenBorderSmall"
                          : ""
                      } `}
                      href="#"
                    >
                      Search
                    </a>
                  </li>
                  {this.state.user != null ? (
                    <li className="nav-item mb-3 mb-lg-0">
                      <a
                        onClick={this.setView.bind(this, { view: SAVED })}
                        className={`nav-link fs-5 mx-3 p-2 mh-100 ${
                          this.state.currentView === SAVED
                            ? "greenBorderSmall"
                            : ""
                        } `}
                        href="#"
                      >
                        Saved Routes
                      </a>
                    </li>
                  ) : null}
                </ul>
                {/* Login, register and profile links on the rightmost */}
                <ul className="navbar-nav ms-auto mb-2 mb-lg-0 mx-2">
                  {this.state.user == null ? (
                    <li className="nav-item">
                      <a
                        onClick={this.setView.bind(this, { view: LOGIN })}
                        className="btn bg-white rounded-pill px-4"
                        href="#"
                      >
                        LOGIN
                      </a>
                      <a
                        onClick={this.setView.bind(this, { view: SIGNUP })}
                        className="btn btn-primary rounded-pill px-3 mx-2"
                        href="#"
                      >
                        SIGN UP
                      </a>
                    </li>
                  ) : (
                    <li className="nav-item mx-0">
                      <a
                        // ONCLICK LOGOUT AND GO TO HOME PAGE
                        className="btn bg-white rounded-pill px-3"
                        href="#"
                      >
                        LOGOUT
                      </a>
                      <a
                        onClick={this.setView.bind(this, { view: PROFILE })}
                        className="mx-2"
                        href="#"
                      >
                        <img
                          style={{ height: "50px" }}
                          src="./assets/images/profile-green.png"
                          alt="profile"
                        ></img>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </nav>
        </div>
        <div id="view" className="w-100">
          {this.getView(this.state.currentView)}
          {this.state.status.success ? (
            <div className="d-flex justify-content-center">
              <p className="alert alert-success w-50 mt-2">
                {this.state.status.message}
              </p>
            </div>
          ) : null}
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
