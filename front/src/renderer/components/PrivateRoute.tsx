/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Redirect, Route } from 'react-router-dom';

type PropTypes = {
  children: React.ReactFragment;
  path: string;
  exact?: boolean;
};

const PrivateRoute = ({ children, ...rest }: PropTypes) => {
  const token = window.electron.store.get('token');
  return (
    <Route
      {...rest}
      render={({ location }) =>
        token ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

PrivateRoute.defaultProps = {
  exact: false,
};

export default PrivateRoute;
