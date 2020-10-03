import React, { Component } from "react";
import { Link } from "react-router-dom";

class Landing extends Component {
  render() {
    return (
      <div className="ui text container" style={{ textAlign: "center" }}>
        <h2 style={{ marginTop: "5em" }}>
          Do whatever you want when you want to.
        </h2>
        <Link to="/register">
          <div
            className="ui huge black button"
            style={{ marginTop: "3em", marginRight: "2em" }}
          >
            Sign Up
          </div>
        </Link>
        <Link to="/login">
          <div className="ui huge basic button" tabIndex="0">
            Login
          </div>
        </Link>
      </div>
    );
  }
}

export default Landing;
