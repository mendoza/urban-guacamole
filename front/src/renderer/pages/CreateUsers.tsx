import { useState } from 'react';
import { toast } from 'react-toastify';
import { removeNumbers } from 'renderer/utils/formHelpers';
import NavBar from '../components/NavBar';
import api from '../utils/api';

const InviteUser = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');

  return (
    <>
      <NavBar />
      <div className="flex w-full h-full">
        <div className="flex w-full justify-center items-center mx-8">
          <div className="flex flex-col py-4 px-8 bg-white shadow-lg rounded-lg w-full">
            <div className="flex flex-row">
              <h3 className="text-4xl font-normal leading-normal mt-0 mb-2 text-blue-800">
                Create user
              </h3>
            </div>
            <form
              className="grid grid-cols-2 gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                e.persist();
                try {
                  await api.post(
                    'admin/users',
                    {
                      email,
                      password,
                      role,
                      name: `${firstName} ${lastName}`,
                    },
                    {
                      headers: {
                        authorization: window.electron.store.get('token'),
                      },
                    }
                  );
                  toast.success('User created Successfully!');
                  setEmail('');
                  setFirstName('');
                  setLastName('');
                  setPassword('');
                  setRole('admin');
                } catch (error) {
                  toast.error('There was an error creating the user');
                }
              }}
            >
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
              <div className="">
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
              <div className="">
                <label className="block" htmlFor="firstname">
                  First Name
                  <input
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(removeNumbers(e.currentTarget.value));
                    }}
                    id="firstname"
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </label>
              </div>
              <div className="">
                <label className="block" htmlFor="lastname">
                  Last Name
                  <input
                    value={lastName}
                    onChange={(e) => {
                      setLastName(removeNumbers(e.currentTarget.value));
                    }}
                    id="lastname"
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </label>
              </div>
              <div className="col-span-2">
                <label className="block" htmlFor="email">
                  Role
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.currentTarget.value);
                    }}
                    id="email"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="admin">Admin</option>
                    <option value="annotator">Annotator</option>
                    <option value="verifier">Verifier</option>
                  </select>
                </label>
              </div>
              <div className="col-span-2 flex items-baseline justify-around">
                <button
                  type="submit"
                  className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default InviteUser;
