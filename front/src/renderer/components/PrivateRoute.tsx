/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Redirect, Route, RouteComponentProps } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

type PropTypes = {
  component:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<unknown>;
  path: string;
  roles?: Array<string>;
  exact?: boolean;
};

const PrivateRoute = ({ component: Component, roles, ...rest }: PropTypes) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        const token = window.electron.store.get('token') || '';
        if (!token) {
          return (
            <Redirect
              // eslint-disable-next-line react/prop-types
              to={{ pathname: '/login', state: { from: props.location } }}
            />
          );
        }

        const { role } = jwt_decode(token) as any;
        if (role && !roles?.includes(role)) {
          return <Redirect to="/" />;
        }
        // authorised so return component
        return <Component {...props} />;
      }}
    />
  );
};

PrivateRoute.defaultProps = {
  exact: false,
  roles: [],
};

export default PrivateRoute;
