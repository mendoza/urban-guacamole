import { useEffect } from 'react';
import { MemoryRouter as Router, Switch, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'tailwindcss/components.css';
import 'tailwindcss/base.css';
import 'tailwindcss/utilities.css';
import 'react-toastify/dist/ReactToastify.css';
import PrivateRoute from './components/PrivateRoute';
import Routes from './Routes';

const App = () => {
  useEffect(() => {
    const hasUsedTheApp = window.electron.store.get('hasUsedTheApp');
    console.log(hasUsedTheApp);
    if (hasUsedTheApp === undefined) {
      window.electron.store.set('hasUsedTheApp', true);
      window.electron.store.set('endpoint', 'http://localhost:3001/');
    }
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
      />
      <Router>
        <Switch>
          {Routes.map((page, idx) => {
            if (page.private) {
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
    </>
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
