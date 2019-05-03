import React, { Component } from 'react';

import Header from '../Header/Header'
import PlayAgainModal from '../PlayAgainModal/PlayAgainModal'

import './Game.css'

class Game extends Component {
  constructor(){
    super();
    this.canvas = null
    this.ctx = null
    this.ucanvas = null
    this.uctx = null
  }

   componentDidMount = () => {
    this.canvas = this.refs.canvas
    this.ctx = this.canvas.getContext('2d')
    this.ucanvas = this.refs.ucanvas
    this.uctx = this.ucanvas.getContext('2d')
    this.startGame(this.canvas,this.ctx,this.ucanvas,this.uctx);
  }

  startGame = (canvas,ctx,ucanvas,uctx)=>{
    this.props.gameShouldStart(canvas,ctx,ucanvas,uctx)
  }
  
  handleGameReset = () => {
    this.startGame(this.canvas,this.ctx,this.ucanvas,this.uctx);
  }


  render() { 
    return ( 
      <>
      <Header />  
      <PlayAgainModal 
        playAgainModalIsOpen={this.props.playAgainModalIsOpen}
        score={this.props.score}
        toggleModal={this.props.toggleModal}
        resetGame={this.handleGameReset}
      />
      
      <div id="tetris">
         <div id="menu">
           <p><canvas ref="ucanvas"></canvas></p>
           <p>score <span id="score">00000</span></p>
           <p>rows <span id="rows">0</span></p>
         </div>
         <canvas ref="canvas" id="canvas">
           Sorry, this example cannot be run because your browser does not support the &lt;canvas&gt; element
         </canvas>
       </div> 
      </> 
    );
  }
}
 
export default Game;