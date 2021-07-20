
import short from 'short-uuid';
import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

import ExcalidrawApp from './components/ExcalidrawApp';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
        <Switch>
          <Route exact path='/:id' component={ExcalidrawApp}/>
          <Route path='/'>
            <Redirect  to={'/'+short.generate()} />
          </Route>
        </Switch>
        </div>
      </Router>
    );
  }
}

export default App;