import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from "react-router-dom";
import { Routes } from "../routes";

import DashboardOverview from "./dashboard/DashboardOverview";
import Signin from "./public/Signin";
import Signup from "./public/Signup";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Preloader from "../components/Preloader";
import ServerError from './components/ServerError';

import io from 'socket.io-client';
import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import authentication from '@feathersjs/authentication-client';
import { Store } from 'react-notifications-component';

const socket = io(process.env.REACT_APP_API_URL);
const client = feathers();

client.configure(socketio(socket));
client.configure(authentication({
  storage: localStorage
}));

const RouteWithLoader = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <Route {...rest} render={props => (<> <Preloader show={loaded ? false : true} /> <Component {...props} setLoaded={setLoaded} /> </>)} />
  );
};

const RouteWithSidebar = ({ component: Component, ...rest }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const localStorageIsSettingsVisible = () => {
    return localStorage.getItem('settingsVisible') === 'false' ? false : true
  }

  const [showSettings, setShowSettings] = useState(localStorageIsSettingsVisible);

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    localStorage.setItem('settingsVisible', !showSettings);
  }

  return (
    <Route {...rest} render={props => (
      <>
        <Preloader show={loaded ? false : true} />
        <Sidebar />

        <main className="content">
          <Navbar />
          <Component {...props} />
          <Footer toggleSettings={toggleSettings} showSettings={showSettings} />
        </main>
      </>
    )}
    />
  );
};

export default class HomePage extends React.Component {
  state = {
    ready: false,
    error: false,
    user: null
  }
  componentDidMount() {
    socket.on('connect', async () => {
      let user = null;
      try {
        user = await client.reAuthenticate();
      } catch (e) { };
      this.setState({ ready: true, error: false, user });
    });
    socket.on('connect_error', (e) => {
      this.setState({ ready: true, error: true });
    });
  }
  async login(username, password) {
    try {
      const user = await client.authenticate({
        username, password, strategy: 'local'
      });
      this.setState({ user });
    } catch (e) {
      alert(e.message);
    }
  }
  notify({ title, message, type, container }) {
    Store.addNotification({
      title, message, type, container, dismiss: {
        duration: 5000,
        onScreen: true
      }
    });
  }
  render() {
    const { ready, user, error } = this.state;
    return ready ? (
      error ? (
        <ServerError />
      ) : (
        user ? (
          <Switch>
            <RouteWithSidebar exact path={'/'} component={DashboardOverview} />
            <Redirect to={'/'} />
          </Switch >
        ) : (
          <Switch>
            <RouteWithLoader exact path={Routes.Signin.path} component={(e) => <Signin {...e} notify={this.notify} client={client} />} />
            <RouteWithLoader exact path={Routes.Signup.path} component={(e) => <Signup {...e} notify={this.notify} client={client} />} />
            <Redirect to={'/'} />
          </Switch>
        )
      )
    ) : (
      <Preloader show={true} />
    )
  }
}
