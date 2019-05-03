import React, { Component } from 'react';

class Leaderboard extends Component {
  state = {  }
  render() { 
    const { leaderboard } = this.props
    return ( 
      <div className="Leaderboard">
      <ol>
        {leaderboard.map((leader, index)=>{
          return (
            <li key={index}>
              <img style={{width: '100px', height: '100px', borderRadius: '50%'}} id="ItemPreview" src={`${process.env.REACT_APP_PUBLIC_URL}uploads/media/${leader.profileImage}`} />
              {leader.username}: {leader.score}
            </li>
          )
        })}
      </ol>
      </div>
     );
  }
}
 
export default Leaderboard;