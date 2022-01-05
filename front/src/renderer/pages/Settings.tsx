import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import NavBar from '../components/NavBar';

const Settings = () => {
  const [endpoint, setEndpoint] = useState('');
  useEffect(() => {
    const currentEndpoint = window.electron.store.get('endpoint');
    if (currentEndpoint) {
      setEndpoint(currentEndpoint);
    }
  }, []);
  return (
    <>
      <NavBar />
      <div className="flex w-full h-full">
        <div className="flex w-full justify-center items-center mx-8">
          <div className="flex flex-col py-4 px-8 bg-white shadow-lg rounded-lg w-full">
            <div className="flex flex-row">
              <h3 className="text-4xl font-normal leading-normal mt-0 mb-2 text-blue-800">
                User Settings
              </h3>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.persist();
                const endpointRegex = /(https?:\/\/.*):(\d*)\/?(.*)/;
                if (endpointRegex.test(endpoint)) {
                  window.electron.store.set('endpoint', endpoint);
                  toast.success('Successfully updated, the API endpoint');
                }
                toast.success('Please relaunch the app!');
              }}
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block" htmlFor="endpoint">
                    API Endpoint
                    <input
                      value={endpoint}
                      onChange={(e) => {
                        setEndpoint(e.target.value);
                      }}
                      id="endpoint"
                      type="text"
                      placeholder="API Endpoint"
                      className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </label>
                </div>
              </div>
              <div className="col-span-2 flex items-baseline justify-around">
                <button
                  type="submit"
                  className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
