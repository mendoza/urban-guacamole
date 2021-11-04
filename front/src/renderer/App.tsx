import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import 'tailwindcss/components.css';
import 'tailwindcss/base.css';
import 'tailwindcss/utilities.css';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';

const App = () => {
  return (
    <Router>
      <Switch>
        <PrivateRoute exact path="/">
          <Home />
        </PrivateRoute>
        <Route path="/login">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
};

declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
        delete: (key: string) => void;
        // any other methods you've defined...
      };
    };
  }
}
export default App;
