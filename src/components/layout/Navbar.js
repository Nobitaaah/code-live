import React, { Component } from "react";
import { Link } from "react-router-dom";

class Navbar extends Component {
  render() {
    return (
      <div
        className="ui text container"
        style={{ textAlign: "center", marginTop: "3em" }}
      >
        <Link to="/">
          <h1 className="ui header">LIVE</h1>
        </Link>
      </div>
    );
  }
}
export default Navbar;
