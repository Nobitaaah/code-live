import React, {useEffect} from "react";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import { Register, Login, Landing, Navbar, Dashboard, PrivateRoute, Editor, MainPage } from './components'
import store from "./store";

import "./App.css";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = "./login";
  }
}

function App() {
  
    useEffect(() => {
    document.title = "CodeLive"
 }, []);

  const io = require('socket.io-client')
  // URL of server, todo: add dynamic url 
  const socket = io('http://localhost:5000', { path: '/sockets' })
  // const socket = io('http://192.168.100.35:3000', { path: '/sockets' })
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          {/* <Route exact path={["/", "/register", "/login"]} component={Navbar} /> */}
          {/* <Route exact path="/" component={Landing} /> */}
          <Route exact path="/register" component={Register} />
          <Route exact path="/editor/:id([A-Za-z]{6})" component={() => <Editor socket={socket}></Editor>} />
          <Route exact path="/" component={() => <MainPage socket={socket} />} />
          <Route exact path="/login" component={Login} />
          <Switch>
            <PrivateRoute exact path="/dashboard" component={() => <Dashboard socket={socket} />} />
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
