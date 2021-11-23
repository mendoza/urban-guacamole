import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import 'tailwindcss/components.css';
import 'tailwindcss/base.css';
import 'tailwindcss/utilities.css';
import PrivateRoute from './components/PrivateRoute';
import Routes from './Routes';

const App = () => {
  return (
    <Router>
      <Switch>
        {Routes.map((page, idx) => {
          if (page.private) {
            const role = window.electron.store.get('role') || '';
            if (page.roles?.includes(role))
              return (
                <PrivateRoute
                  // eslint-disable-next-line react/no-array-index-key
                  key={`route-private-${idx}`}
                  exact={page.exact}
                  path={page.path}
                  roles={page.roles}
                  component={page.component}
                />
              );
            return undefined;
          }
          return (
            <Route
              // eslint-disable-next-line react/no-array-index-key
              key={`route-public-${idx}`}
              exact={page.exact}
              path={page.path}
              component={page.component}
            />
          );
        })}
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
