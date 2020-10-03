import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { loginUser } from "../../actions/authActions";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      togglePassword: false,
      errors: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard"); // push user to dashboard when they login
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  componentDidMount() {
    // If logged in and user navigates to Login page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onClick = (e) => {
    this.setState({ togglePassword: !this.state.togglePassword });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const userData = {
      email: this.state.email,
      password: this.state.password,
    };
    this.props.loginUser(userData);
  };

  render() {
    const { errors, togglePassword } = this.state;

    return (
      <div className="ui middle aligned grid text container">
        <div className="column" style={{ marginTop: "5em" }}>
          <div className="ui icon buttons">
            <Link to="/">
              <button className="ui button">
                <i className="chevron left icon"></i>
              </button>
            </Link>
          </div>
          <h2 className="ui black header">
            <div className="content">Login</div>
          </h2>
          <form noValidate onSubmit={this.onSubmit} className="ui form">
            <div className="field">
              <label>E-Mail</label>
              <input
                onChange={this.onChange}
                value={this.state.email}
                error={errors.email}
                type="email"
                id="email"
                className={classnames("", {
                  invalid: errors.email || errors.emailNotFound,
                })}
              />
              <span style={{ color: "red" }}>
                {errors.email}
                {errors.emailNotFound}
              </span>
            </div>
            <div className="field">
              <label>Password</label>
              <div className="ui icon input">
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.email}
                  type={togglePassword ? "text" : "password"}
                  id="password"
                  autoComplete="off"
                  className={classnames("", {
                    invalid: errors.password || errors.passwordIncorrect,
                  })}
                />
                {togglePassword ? (
                  <i
                    className="circular link eye icon"
                    onClick={this.onClick}
                  ></i>
                ) : (
                  <i
                    className="circular link eye slash icon"
                    onClick={this.onClick}
                  ></i>
                )}
              </div>
              <span style={{ color: "red" }}>
                {errors.password}
                {errors.passwordIncorrect}
              </span>
            </div>
            <button className="ui animated button" type="submit" tabIndex="0">
              <div className="visible content">Login</div>
              <div className="hidden content">
                <i className="sign-in icon"></i>
              </div>
            </button>
          </form>

          <div className="ui yellow message">
            New to us? <Link to="/register">Sign Up</Link>
          </div>
        </div>
      </div>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { loginUser })(Login);
