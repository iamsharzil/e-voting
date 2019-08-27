import React, { Component, Fragment } from 'react';
import api from './services/api';

class App extends Component {
  async componentDidMount() {
    const res = await api.call('post', 'auth/login', {
      username: 'username',
      password: 'passssword'
    });

    console.log(res);
  }

  render() {
    return <Fragment>Hello world</Fragment>;
  }
}

export default App;
