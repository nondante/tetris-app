import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import jwt_decode from 'jwt-decode'

const ProtectedRoute = ({component: Component}, ...rest) => {
  return(
    <Route {...rest} 
      render={
        (props) => {
          let token = localStorage.getItem("Token")
          if(token){
            if(jwt_decode(token).exp >= Date.now() / 1000){
              return <Component  {...props} />
            } else {
              localStorage.clear();
              return <Redirect to={{pathname: "/login"}} />
            }
          } else {
            localStorage.clear();
            return <Redirect to={{pathname: "/login"}} />
          }
        }
    }  />
  )
}
export default ProtectedRoute