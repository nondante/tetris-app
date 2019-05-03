import React, { Component } from 'react';
import FormData from 'form-data'

import API from "../helpers/API";
import Profile from '../components/Profile/Profile'
import Header from '../components/Header/Header'

class ProfileContainer extends Component {
  state = { 
    profileImg: 'default.jpg',
    totalScore: 0,
    highScore:0,
    email: '',
    username: '',
   }

  componentDidMount(){
    this.getProfile()
  }

  getProfile = async() => {
    let data = await API.get(`${process.env.REACT_APP_APIURL}users/self`)
    let user = data.data.payload.user
    let scoreData = await API.get(`${process.env.REACT_APP_APIURL}leaderboard/${user.username}`)
    let totalScore = scoreData.data.payload.totalScore
    let highScore = scoreData.data.payload.highScore
    this.setState({
      profileImg: user.profileImage,
      totalScore,
      highScore,
      username: user.username,
      email: user.email
    }) 

  }
  onDrop = async(image) => {
    let formData = new FormData();
    formData.append('media', image[image.length-1],image[image.length-1].name);  
    let imgData = await API.post(`${process.env.REACT_APP_APIURL}users/${this.state.username}/img`, formData)
    let img = imgData.data.payload.image;
    this.setState({
      profileImg: img,
    }) 
  }

  render() {
    const { profileImg, totalScore, username, email, highScore } = this.state 
    return (
      <>
      <Header handleClick={this.handleClick}/> 
      <Profile
        profileImg={profileImg}
        totalScore={totalScore}
        username={username}
        email={email}
        highScore={highScore}
        onDrop={this.onDrop} 
      />
      </>
    );
  }
}
 
export default ProfileContainer;