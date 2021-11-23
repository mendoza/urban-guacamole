import AnnotatePicture from './pages/AnnotatePicture';
import LoadPreclass from './pages/LoadPreclass';
import Login from './pages/Login';

const Routes = [
  {
    component: LoadPreclass,
    exact: true,
    path: '/',
    roles: ['admin'],
    private: true,
  },
  {
    component: AnnotatePicture,
    exact: true,
    path: '/',
    roles: ['annotator'],
    private: true,
  },
  { component: Login, private: false, path: '/login', exact: true },
];

export default Routes;
