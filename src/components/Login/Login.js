import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

class Login extends Component {

  handleEmail = (e)=>{
    this.props.handleEamilChange(e.target.value)
  }

  handlePassword = (e)=>{
    this.props.handlePasswordChange(e.target.value)
  }
  

  render() {
    return (
      <div className="Login">
        <form className="Login__form">
          <h2 className="mb-5">Login</h2>
          <div className="form-group">
            <label>email</label>
            <input
              required
              type="email"
              name="email"
              className="form-control"
              onChange={(e) => {this.handleEmail(e)}}
            />
          </div>

          <div className="form-group">
            <label>password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              onChange={(e) => {this.handlePassword(e)}}
            />
          </div>

          <div className="mt-5">
            <button className="btn btn-dark" onClick={this.props.handleClick}>
              login
            </button>
          </div>
          <div className="mt-5">
            <Link to="/register">register here</Link>
          </div>
        </form>
      </div>
    );
  }
}

export default Login;
