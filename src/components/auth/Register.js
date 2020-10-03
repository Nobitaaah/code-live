import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import classnames from "classnames";
import { registerUser } from "../../actions/authActions";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      togglePassword: false,
      togglePassword2: false,
      errors: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors,
      });
    }
  }

  componentDidMount() {
    // If logged in and user navigates to Register page, should redirect them to dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onClick = (e) => {
    this.setState({
      togglePassword: !this.state.togglePassword,
    });
  };

  toggle = (e) => {
    this.setState({ togglePassword2: !this.state.togglePassword2 });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
    };
    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors, togglePassword, togglePassword2 } = this.state;

    return (
      <div className="ui middle aligned grid text container">
        <div className="column" style={{ marginTop: "5em" }}>
          <Link to="/">
            <button class="ui button">
              <i class="chevron left icon"></i>
            </button>
          </Link>
          <h2 className="ui black header">
            <div className="content">Sign-Up</div>
          </h2>
          <form noValidate onSubmit={this.onSubmit} className="ui form">
            <div className="field">
              <label>Full Name</label>
              <input
                onChange={this.onChange}
                value={this.state.name}
                error={errors.name}
                type="text"
                id="name"
                autoComplete="off"
                className={classnames("", {
                  invalid: errors.name,
                })}
              />
              <span style={{ color: "red" }}>{errors.name}</span>
            </div>
            <div className="field">
              <label>E-Mail</label>
              <input
                onChange={this.onChange}
                value={this.state.email}
                error={errors.email}
                type="email"
                id="email"
                autoComplete="off"
                className={classnames("", {
                  invalid: errors.email,
                })}
              />
              <span style={{ color: "red" }}>{errors.email}</span>
            </div>
            <div className="field">
              <label>Password</label>
              <div className="ui icon input">
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  type={togglePassword ? "text" : "password"}
                  id="password"
                  className={classnames("", {
                    invalid: errors.password,
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
              <span style={{ color: "red" }}>{errors.password}</span>
            </div>
            <div className="field">
              <label>Confirm Password</label>
              <div className="ui icon input">
                <input
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  type={togglePassword2 ? "text" : "password"}
                  id="password2"
                  className={classnames("", {
                    invalid: errors.password2,
                  })}
                />
                {togglePassword2 ? (
                  <i
                    className="circular link eye icon"
                    onClick={this.toggle}
                  ></i>
                ) : (
                  <i
                    className="circular link eye slash icon"
                    onClick={this.toggle}
                  ></i>
                )}
              </div>
              <span style={{ color: "red" }}>{errors.password2}</span>
            </div>
            <button className="ui animated button" type="submit" tabIndex="0">
              <div className="visible content">Sign Up</div>
              <div className="hidden content">
                <i class="sign-in icon"></i>
              </div>
            </button>
          </form>

          <div className="ui yellow message">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));
