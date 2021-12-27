import Login from './pages/Login';
import AnnotatePicture from './pages/AnnotatePicture';
import AssignAnnotation from './pages/AssignAnnotation';
import LoadPreclass from './pages/LoadPreclass';
import Verify from './pages/Verify';
import CreateUsers from './pages/CreateUsers';

const Routes = [
  {
    component: LoadPreclass,
    exact: true,
    path: '/admin',
    roles: ['admin'],
    name: 'Home',
    private: true,
  },
  {
    component: AssignAnnotation,
    exact: true,
    path: '/admin/assign',
    name: 'Assign annotation',
    roles: ['admin'],
    private: true,
  },
  {
    component: CreateUsers,
    exact: true,
    path: '/admin/create',
    name: 'Create User',
    roles: ['admin'],
    private: true,
  },
  {
    component: Verify,
    exact: true,
    path: '/verifier',
    name: 'Home',
    roles: ['verifier'],
    private: true,
  },
  {
    component: AnnotatePicture,
    exact: true,
    path: '/annotator',
    name: 'Home',
    roles: ['annotator'],
    private: true,
  },
  { component: Login, private: false, path: '/', exact: true },
];

export default Routes;
