import React, { Component } from 'react';


import API from "../helpers/API"
import Game from "../components/Game/Game"
import Play from '../components/Game/utils/gameLogic'

class GameContainer extends Component {

  state = { 
    score: 0,
    playAgainModalIsOpen: false
  }

  handleGameStart = async (canvas,ctx,ucanvas,uctx) => {
    const getScore = async(score) => {
      let data = await API.get(`${process.env.REACT_APP_APIURL}users/self`)
      let username = data.data.payload.user.username
      let profileImage = data.data.payload.user.profileImage
      await API.post(`${process.env.REACT_APP_APIURL}leaderboard`, {
        username,
        score,
        profileImage
      })
      this.setState({
        score,
        playAgainModalIsOpen: true,
      })
     
    }
     const game = new Play(canvas,ctx,ucanvas,uctx,getScore)
     game.run()
  }

  toggleModal = () => {
    this.setState(prevState => ({
      playAgainModalIsOpen: !prevState.playAgainModalIsOpen
    }))
  }

  render() { 
    return ( 
      <Game 
        gameShouldStart={this.handleGameStart}
        playAgainModalIsOpen={this.state.playAgainModalIsOpen}
        score={this.state.score}
        toggleModal={this.toggleModal}
      />
     );
  }
}
 
export default GameContainer;