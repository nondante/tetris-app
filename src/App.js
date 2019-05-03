import React from "react";
import { Link } from "react-router-dom";

import Header from '../src/components/Header/Header'
import ProfileCard from '../src/components/ProfileCard/ProfileCard'
import logo from './logo.png'; 

import "./App.css";

const App = (props) => (
  <div className="App containe0 mt-3">
    <div className="row d-flex justify-content-center">
        <div className="triangle-profile d-flex justify-content-center">
          <ProfileCard 
            profileImg={props.profileImg}
            username={props.username}
            totalScore={props.totalScore}
            highScore={props.highScore}
            email={props.email}
          />
        </div>
        <div className="triangle-play d-flex justify-content-center">
          <img className="logo" alt="logo" src={logo} />
          <Link className="play" to="/game">Play</Link>
        </div>
    </div>
  </div>
);

export default App;
