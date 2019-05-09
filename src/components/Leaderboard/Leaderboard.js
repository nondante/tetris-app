import React, { Component } from 'react';

import './Leaderboard.css'

class Leaderboard extends Component {
  state = {  }
  render() { 
    const { leaderboard } = this.props
    return ( 
      <div className="Leaderboard mt-3">
      <ol>
        {leaderboard.map((leader, index)=>{
          if(index===0){
            return (
              <li className="leader" key={index}>
                <img className="leaderboardImage" src={`${process.env.REACT_APP_PUBLIC_URL}uploads/media/${leader.profileImage}`} />
                {leader.username}: {leader.score} <i className="fas fa-crown crown"></i>
              </li>
            )
          } else {
            return (
              <li key={index}>
                <img className="leaderboardImage" src={`${process.env.REACT_APP_PUBLIC_URL}uploads/media/${leader.profileImage}`} />
                {leader.username}: {leader.score}
              </li>
            )
          }
        })}
      </ol>
      </div>
     );
  }
}
 
export default Leaderboard;