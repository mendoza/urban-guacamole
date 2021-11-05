import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import api from '../utils/api';
import Alert from '../components/Alert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const history = useHistory();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg">
        <h3 className="text-2xl font-bold text-center">
          Login to your account
        </h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            e.persist();
            try {
              const { data } = await api.post('/auth/login', {
                email,
                password,
              });
              window.electron.store.set('token', data.token);
              history.push('/');
              if (showError) {
                setShowError(false);
                setError('');
              }
            } catch ({ response }) {
              setError('Error on authentication');
              setShowError(true);
            }
            // eslint-disable-next-line promise/always-return
          }}
        >
          <div className="mt-4">
            <div>
              <label className="block" htmlFor="email">
                Email
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.currentTarget.value);
                  }}
                  id="email"
                  type="text"
                  placeholder="Email"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </label>
            </div>
            <div className="mt-4">
              <label className="block" htmlFor="password">
                Password
                <input
                  value={password}
                  onChange={(e) => {
                    setPassword(e.currentTarget.value);
                  }}
                  id="password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </label>
            </div>
            <Alert text={error} visible={showError} />
            <div className="flex items-baseline justify-around">
              <button
                type="submit"
                className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
              >
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;