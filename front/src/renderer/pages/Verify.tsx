/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
import { useEffect, useState } from 'react';
import {
  FaCheck,
  FaMinus,
  FaTimes,
  FaSync,
  FaCheckDouble,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import NavBar from '../components/NavBar';
import api from '../utils/api';

const Verify = () => {
  const [toVerify, setToVerify] = useState<Array<any>>([]);
  const asyncGet = async () => {
    try {
      const { data } = await api.get('/annotation/verify', {
        headers: {
          authorization: window.electron.store.get('token'),
        },
      });
      setToVerify(
        data.found.map((item: any) => ({ ...item, selected: false }))
      );
      toast.success('Successfully got images to verify');
    } catch (error) {
      toast.error('Error getting images to verify');
    }
  };

  useEffect(() => {
    asyncGet();
  }, []);

  return (
    <>
      <NavBar />
      <div className="flex w-full h-full">
        <div
          style={{ height: '80vh' }}
          className="flex w-full justify-center items-center"
        >
          <div className="bg-white shadow-lg rounded-lg my-2 mx-8 p-4 overflow-auto h-full w-3/4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {toVerify.map((item, idx) => {
                return (
                  <div
                    key={`to-verify-${idx}`}
                    tabIndex={0}
                    role="button"
                    onKeyDown={(e) => {
                      if (['Enter', ' '].includes(e.key))
                        setToVerify(
                          toVerify.map((itemInner, index) => {
                            if (index !== idx) return itemInner;
                            return {
                              ...itemInner,
                              selected: !itemInner.selected,
                            };
                          })
                        );
                    }}
                    onClick={() => {
                      setToVerify(
                        toVerify.map((itemInner, index) => {
                          if (index !== idx) return itemInner;
                          return {
                            ...itemInner,
                            selected: !itemInner.selected,
                          };
                        })
                      );
                    }}
                    className={`flex flex-col justify-center items-center bg-white shadow-lg rounded-lg p-2 cursor-pointer ${
                      item.selected && 'border-2 border-blue-700'
                    }`}
                  >
                    <img
                      alt={item.path}
                      className="object-contain h-auto xl:w-5/6 w-full"
                      src={`http://localhost:3001/img/${item.path}`}
                    />
                    <div className="flex flex-col capitalize mt-2">
                      <p>
                        Type of image: <b>{item.panels}</b>
                      </p>
                      <p
                        hidden={
                          item.panels === 'multiple' || item.panels === ''
                        }
                      >
                        Contains at least one chart:{' '}
                        <b>{item.containsChart ? 'Yes' : 'No'}</b>
                      </p>
                      <p hidden={!item.containsChart}>
                        Type of chart: <b>{item.typeOfChart}</b>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg my-2 mx-8 p-4 self-start overflow-auto w-1/4  lg:h-1/2 h-full  flex flex-col justify-around">
            <h3 className="text-2xl font-normal leading-normal mt-0 mb-2">
              Actions
            </h3>

            <button
              type="button"
              onClick={async () => {
                try {
                  await api.post(
                    '/annotation/verify',
                    {
                      correct: toVerify
                        .filter((item) => item.selected)
                        .map((item) => item.path),
                    },
                    {
                      headers: {
                        authorization: window.electron.store.get('token'),
                      },
                    }
                  );
                  toast.success('Successfully verified images');
                  asyncGet();
                } catch (error) {
                  toast.error('Error verifying the images');
                }
              }}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center"
            >
              <FaCheck className="mr-2" /> Correct
            </button>
            <button
              type="button"
              onClick={async () => {
                try {
                  await api.post(
                    '/annotation/verify',
                    {
                      wrong: toVerify
                        .filter((item) => !item.selected)
                        .map((item) => item.path),
                    },
                    {
                      headers: {
                        authorization: window.electron.store.get('token'),
                      },
                    }
                  );
                  toast.success('Successfully verified images');
                  asyncGet();
                } catch (error) {
                  toast.error('Error verifying the images');
                }
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center"
            >
              <FaTimes className="mr-2" /> Wrong
            </button>
            <button
              type="button"
              onClick={() => {
                asyncGet();
              }}
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center"
            >
              <FaSync className="mr-2" /> Sync
            </button>
            <button
              type="button"
              onClick={() => {
                setToVerify(
                  toVerify.map((item) => ({ ...item, selected: true }))
                );
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center"
            >
              <FaCheckDouble className="mr-2" /> Select All
            </button>
            <button
              type="button"
              onClick={() => {
                setToVerify(
                  toVerify.map((item) => ({ ...item, selected: false }))
                );
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center"
            >
              <FaMinus className="mr-2" /> Clear
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Verify;
