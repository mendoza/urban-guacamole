import AnnotatePicture from './pages/AnnotatePicture';
import LoadPreclass from './pages/LoadPreclass';
import Login from './pages/Login';
import Verify from './pages/Verify';

const Routes = [
  {
    component: LoadPreclass,
    exact: true,
    path: '/admin',
    roles: ['admin'],
    private: true,
  },
  {
    component: Verify,
    exact: true,
    path: '/verifier',
    roles: ['verifier'],
    private: true,
  },
  {
    component: AnnotatePicture,
    exact: true,
    path: '/annotator',
    roles: ['annotator'],
    private: true,
  },
  { component: Login, private: false, path: '/', exact: true },
];

export default Routes;
