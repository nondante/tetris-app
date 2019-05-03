import React from "react";
import ReactDOM from "react-dom";
import dotenv from "dotenv";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import AppContainer from "./containers/AppContainer";
import LoginContainer from "./containers/LoginContainer";
import RegisterContainer from "./containers/RegisterContainer";
import GameContainer from "./containers/GameContainer"
import ProtectedRoute from './ProtectedRoute'
import ProfileContainer from "./containers/ProfileContainer";
import LeaderboardContainer from "./containers/LeaderboardContainer";

dotenv.config();

const Root = () => (
    <Router>
      <Switch>
        <ProtectedRoute exact
          path="/"
          component={AppContainer}
        />
        <ProtectedRoute exact 
          path="/game" 
          component={GameContainer}
        />
        <ProtectedRoute exact 
          path="/profile" 
          component={ProfileContainer}
        />
        <ProtectedRoute exact 
          path="/leaderboard" 
          component={LeaderboardContainer}
        />
        <Route exact path="/login" component={LoginContainer} />
        <Route exact path="/register" component={RegisterContainer} />
      </Switch>
    </Router>
);

ReactDOM.render(<Root />, document.getElementById("root"));
