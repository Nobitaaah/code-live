import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUser } from "../../actions/authActions";

class Dashboard extends Component {
  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
    // window.location.href = "./login";
  };

  render() {
    const { user } = this.props.auth;
    return (
      <div className="ui text container">
        <div className="row">
          <h4>
            <b>Hi</b>
          </h4>{" "}
          {user.name.split(" ")[0]} <p>You are logged in.</p>
        </div>
        <div class="ui button" onClick={this.onLogoutClick}>
          Logout
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logoutUser })(Dashboard);
