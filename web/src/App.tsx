import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { ProfileMenu } from './components/ProfileMenu';
import { labflowOptions } from './config';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import { ProtocolEditorPage } from './pages/ProtocolEditorPage';
import { RunEditorPage } from './pages/RunEditorPage';
import { auth0State } from './state/atoms';

export default function App() {
  const { auth0Client, isAuthenticated } = useRecoilValue(auth0State);
  if (!isAuthenticated) {
    switch (labflowOptions.authProvider) {
      case 'auth0':   
        if (auth0Client) {
          auth0Client.loginWithRedirect()
          return (
            <div>
              This page requires users to be logged in first. Redirecting to login page...
            </div>
          )
        } else {
          throw new Error("Failed to redirect user to login url. Auth0 is not loaded yet!");
        }
    }
  }

  return (
    <BrowserRouter>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand>
          <Link to="/">
            LabFlow
          </Link>
        </Navbar.Brand>
        <Nav className="mr-auto"></Nav>
        <ProfileMenu />
      </Navbar>
      <div className="container">
        <Switch>
          <Route path="/protocol/:id">
            <ProtocolEditorPage />
          </Route>
          <Route path="/run/:id">
            <RunEditorPage />
          </Route>
          <Route path="/profile/:id">
            <ProfilePage />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
          {/* <Redirect from="/profile" to={`/profile/${user.id}`} /> */}
        </Switch>
      </div>
    </BrowserRouter>
  );
}
