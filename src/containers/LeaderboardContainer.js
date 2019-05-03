import React, { Component } from 'react';
import API from "../helpers/API";

import Leaderboard from '../components/Leaderboard/Leaderboard'
import Header from '../components/Header/Header'

class LeaderboardContainer extends Component {
  state = { 
    leaderboard: [],
  }

  async componentDidMount(){
    let data = await API.get(`${process.env.REACT_APP_APIURL}leaderboard`)
    let leaderboard = data.data.payload.leaderboard
    this.setState({
      leaderboard: leaderboard,
     })
  }

  render() { 
    return ( 
      <>
      <Header />
      <Leaderboard 
        leaderboard={this.state.leaderboard}
      />
      </>
    );
  }
}
 
export default LeaderboardContainer;