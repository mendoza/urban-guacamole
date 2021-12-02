/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import { useState } from 'react';
import { toast } from 'react-toastify';
import NavBar from '../components/NavBar';
import api from '../utils/api';

const LoadPreclass = () => {
  const [preClass, setPreClass] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  return (
    <>
      <NavBar />
      <div className="flex w-full h-full">
        <div
          style={{ height: '80vh' }}
          className="flex w-full justify-center items-center"
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-4 px-4 mr-1 bg-white shadow-lg rounded-lg my-2 h-full w-1/2">
              <div
                style={{ borderTopColor: 'transparent' }}
                className="w-16 h-16 border-4 border-blue-400 border-dotted rounded-full animate-spin"
              />
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-lg m-2 overflow-auto h-full w-1/2">
              <pre>{JSON.stringify(preClass, null, 4)}</pre>
            </div>
          )}
          <div className="flex flex-col justify-center items-center py-4 px-4 ml-1 bg-white shadow-lg rounded-lg my-2 h-full w-1/2">
            <label
              htmlFor="test"
              className="mb-4 w-64 flex flex-col items-center px-4 py-6 bg-white rounded-md shadow-md tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-600 hover:text-white text-blue-600 ease-linear transition-all duration-150"
            >
              <span className="mt-2 text-base text-center leading-normal">
                Select a classification file
              </span>
              <input
                id="test"
                type="file"
                className="hidden"
                disabled={isLoadingUpload || isLoading}
                accept=".json"
                onChange={async (e) => {
                  setIsLoading(true);
                  e.preventDefault();
                  const reader = new FileReader();
                  reader.onload = async (event) => {
                    const text = event.target?.result;
                    const information = JSON.parse(text as string);
                    setPreClass(information);
                    setIsLoading(false);
                  };
                  if (e.target.files)
                    reader.readAsText((e.target.files || [])[0]);
                }}
              />
            </label>
            {JSON.stringify(preClass) !== '{}' && (
              <div className="w-64 flex flex-col items-center px-4 py-6 bg-white rounded-md shadow-md tracking-wide uppercase border border-blue cursor-pointer hover:bg-green-600 hover:text-white text-green-600 ease-linear transition-all duration-150">
                <button
                  id="test"
                  disabled={isLoadingUpload}
                  type="button"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.persist();
                    setIsLoadingUpload(true);
                    try {
                      await api.post(
                        '/annotation/preclass',
                        {
                          data: preClass,
                        },
                        {
                          headers: {
                            authorization: window.electron.store.get('token'),
                          },
                        }
                      );
                      toast.success('Created/Updated preclassification');
                    } catch (error) {
                      toast.error(
                        'Error on creating/updating preclassification'
                      );
                    } finally {
                      setIsLoadingUpload(false);
                    }
                  }}
                >
                  {isLoadingUpload ? (
                    <div
                      style={{ borderTopColor: 'transparent' }}
                      className="w-16 h-16 border-4 border-blue-400 border-dotted rounded-full animate-spin"
                    />
                  ) : (
                    <>Upload classification</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadPreclass;
