import * as React from 'react';
import { Router, Link } from '@reach/router';
import Results from './Results';
import Settings from './Settings';

export class App extends React.Component {
  render() {
    return (
      <div>
        <nav>
          <Link to='/' className='logo'>
            🏠 immo-feed
          </Link>
          <Link to='settings'>Settings</Link>
        </nav>
        <main>
          <Router>
            <Results path='/' />
            <Settings path='settings' />
          </Router>
        </main>
      </div>
    );
  }
}
