import React, { Component } from "react";
import Login from "../components/Login/Login";
import API from '../helpers/API';

class LoginContainer extends Component {

  state = {
    email: null,
    password: null
  };

  onSubmit = async (email, password) => {
    try {
      const loginData = await API.post(process.env.REACT_APP_APIURL + "auth/session", {email, password})
      const token = loginData.data.payload.token
      localStorage.setItem("Token", token);
      if (token) {
        this.props.history.push("/")
      }
    } catch (e){
      console.log("Wrong user credentials")
    }
  };

  handleClick = (e) => {
    e.preventDefault();
    this.onSubmit(this.state.email, this.state.password);
    
  };

  handlePasswordChange = (val) => {
    this.setState(prevState =>({
      password : val
    }))
  }

  handleEamilChange = (val) => {
    this.setState(prevState =>({
      email : val
    }))
  }
  

  render() {
    return <Login 
      onSubmit={this.onSubmit} 
      handleClick = {this.handleClick}
      handlePasswordChange={this.handlePasswordChange}
      handleEamilChange={this.handleEamilChange}
    />;
  }
}


export default LoginContainer;
