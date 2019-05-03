import React, { Component } from 'react';

import './ProfileCard.css'

class ProfileCard extends Component {
  state = {  }
  render() { 
    const { profileImg, username, totalScore, highScore, email } = this.props;
    return ( 
      <div className="ProfileCard" >
      	<div className="login_box">
          <div>
                <div className="outter"><img className="image-circle" src={`${process.env.REACT_APP_PUBLIC_URL}uploads/media/${profileImg}`} /></div>   
                <span className="greeting">Hi, <span className="username">{username}</span></span>
          </div>
          <div className="score text-center">
            <div >
                <span>
                    <span>Total Score: </span> <span className="result">{totalScore}</span>
                </span>
            </div>
            <div>
                <span>
                    <span>High Score: </span> <span className="result">{highScore}</span>
                </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
 
export default ProfileCard;