import React, { Component } from "react";
import Register from "../components/Register/Register";
import API from '../helpers/API';

class RegisterContainer extends Component {

  onSubmit = async (email, username, password) => {
    try {
    await API.post(process.env.REACT_APP_APIURL + "auth/users", {email, username, password})
    } catch (e) {
      console.log(e)
    }
    this.props.history.push("/login");
  };

  render() {
    
    
    return  (
      <Register onSubmit={this.onSubmit} />
    );
  }
}



export default RegisterContainer;
