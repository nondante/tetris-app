import React, { Component } from "react"

import App from "../App";
import Header from '../components/Header/Header'
import API from "../helpers/API";

class AppContainer extends Component {
  constructor() {
    super();

    this.state = {
      profileImg: 'default.jpg',
      totalScore: 0,
      username: '',
      highScore: 0,
      highScore: 0,
      email: ''
    };
  }

  async componentWillMount(){
    let data = await API.get(`${process.env.REACT_APP_APIURL}users/self`)
    let user = data.data.payload.user
    this.setState({
      profileImg: user.profileImage,
      username: user.username,
      email: user.email
     })
    console.log(user.username)
    let scoreData = await API.get(`${process.env.REACT_APP_APIURL}leaderboard/${user.username}`)
    let totalScore = scoreData.data.payload.totalScore
    let highScore = scoreData.data.payload.highScore
    this.setState({
      totalScore,
      highScore
     })
  }

  render() {
    const { profileImg, username, totalScore, highScore, email } = this.state;
    return (
      <>
        <Header />
        <App
          profileImg={profileImg}
          username={username}
          totalScore={totalScore}
          highScore={highScore}
          email={email}
        />
      </>
    )
  }
}

export default AppContainer;
