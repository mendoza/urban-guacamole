import { useCallback, useEffect, useState } from 'react';
import {
  FaCheck,
  FaMinus,
  FaTimes,
  FaSync,
  FaCheckDouble,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import Pagination from '../components/Pagination';
import NavBar from '../components/NavBar';
import api from '../utils/api';
import { chartTypes } from '../utils/Constants';

const pageSize = 8;

const Verify = () => {
  const [toVerify, setToVerify] = useState<Array<any>>([]);
  const [filteredToVerify, setFilteredToVerify] = useState<Array<any>>([]);
  const [panels, setPanels] = useState('all');
  const [contains, setContains] = useState('all');
  const [type, setType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [cannotUpdate, setCannotUpdate] = useState(false);
  const setSellectedToall = useCallback(
    (value) => {
      setFilteredToVerify(
        filteredToVerify.map((item) => ({ ...item, selected: value }))
      );
    },
    [filteredToVerify]
  );
  const asyncGet = useCallback(async () => {
    try {
      const { data } = await api.get('/annotation/verify', {
        headers: {
          authorization: window.electron.store.get('token'),
        },
      });
      setToVerify([
        ...data.found.map((item: any) => ({ ...item, selected: false })),
      ]);

      toast.success('Successfully got images to verify');
    } catch (error) {
      toast.error('Error getting images to verify');
    }
  }, []);

  useEffect(() => {
    setCannotUpdate(filteredToVerify.every((img) => !img.selected));
  }, [filteredToVerify]);

  useEffect(() => {
    asyncGet();
  }, [asyncGet]);

  useEffect(() => {
    const filtered = toVerify
      .filter((item) => panels === 'all' || item.panels === panels)
      .filter(
        (item) =>
          contains === 'all' || item.containsChart === (contains === 'yes')
      )
      .filter((item) => type === 'all' || item.typeOfChart === type);

    setLastPage(Math.ceil(filtered.length / pageSize));
    setFilteredToVerify(
      filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    );
  }, [toVerify, panels, contains, type, currentPage]);

  return (
    <>
      <NavBar />
      <div className="flex w-full h-full flex-col">
        <div
          style={{ height: '80vh' }}
          className="flex w-full justify-center items-center"
        >
          <div className="flex flex-col h-full w-3/4">
            <div className="flex flex-row justify-between mx-8 p-4 bg-white rounded-lg shadow-lg sticky top-4">
              <div className="flex flex-row w-full justify-around">
                <label htmlFor="image-type" className="block text-left">
                  <span className="text-gray-700">Type of Image?</span>
                  <select
                    id="image-type"
                    className="form-select block w-full mt-1"
                    value={panels}
                    onChange={(e) => {
                      setPanels(e.target.value);
                    }}
                  >
                    <option value="all">All</option>
                    <option value="single">Single</option>
                    <option value="multiple">Multiple</option>
                  </select>
                </label>
                <label htmlFor="contains-chart" className="block text-left">
                  <span className="text-gray-700">Contains Chart?</span>
                  <select
                    id="contains-chart"
                    className="form-select block w-full mt-1"
                    value={contains}
                    onChange={(e) => {
                      setContains(e.target.value);
                    }}
                  >
                    <option value="all">All</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
                <label htmlFor="chart-type" className="block text-left">
                  <span className="text-gray-700">Chart Type?</span>
                  <select
                    id="chart-type"
                    className="form-select block w-full mt-1"
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                    }}
                  >
                    <option value="all">All</option>
                    {chartTypes.map((item, index) => {
                      return (
                        // eslint-disable-next-line react/no-array-index-key
                        <option key={`chartype-${index}`} value={item}>
                          {item}
                        </option>
                      );
                    })}
                  </select>
                </label>
                <div className="flex items-center justify-center mb-4">
                  <Pagination
                    currentPage={currentPage}
                    setPage={setCurrentPage}
                    limit={lastPage}
                  />
                </div>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg my-2 mx-8 p-4 overflow-auto h-full">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredToVerify.map((item, idx) => {
                  return (
                    <div
                      key={`to-verify-${idx}`}
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => {
                        if (['Enter', ' '].includes(e.key))
                          setFilteredToVerify(
                            filteredToVerify.map((itemInner, index) => {
                              if (index !== idx) return itemInner;
                              return {
                                ...itemInner,
                                selected: !itemInner.selected,
                              };
                            })
                          );
                      }}
                      onClick={() => {
                        setFilteredToVerify(
                          filteredToVerify.map((itemInner, index) => {
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
                        src={`${window.electron.store.get('endpoint')}img/${
                          item.path
                        }`}
                        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                        role="button"
                        tabIndex={0}
                      />
                      <div className="flex flex-col capitalize mt-2">
                        <p>
                          Type of image: <b>{item.panels}</b>
                        </p>
                        <p>
                          Contains at least one chart:{' '}
                          <b>{item.containsChart ? 'Yes' : 'No'}</b>
                        </p>
                        <p hidden={!item.typeOfChart}>
                          Type of chart: <b>{item.typeOfChart}</b>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg my-2 mx-8 p-4 self-start overflow-auto w-1/4  lg:h-1/2 h-full  flex flex-col justify-around">
            <h3 className="text-2xl font-normal leading-normal mt-0 mb-2">
              Actions
            </h3>
            <button
              type="button"
              disabled={cannotUpdate}
              onClick={async () => {
                try {
                  console.log(
                    filteredToVerify
                      .filter((item) => item.selected)
                      .map((item) => item.path)
                  );
                  // await api.post(
                  //   '/annotation/verify',
                  //   {
                  //     correct: filteredToVerify
                  //       .filter((item) => item.selected)
                  //       .map((item) => item.path),
                  //   },
                  //   {
                  //     headers: {
                  //       authorization: window.electron.store.get('token'),
                  //     },
                  //   }
                  // );
                  toast.success('Successfully verified images');
                  asyncGet();
                } catch (error) {
                  toast.error('Error verifying the images');
                }
              }}
              className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center ${
                cannotUpdate && 'opacity-50'
              }`}
            >
              <FaCheck className="mr-2" /> Correct
            </button>
            <button
              type="button"
              disabled={cannotUpdate}
              onClick={async () => {
                try {
                  await api.post(
                    '/annotation/verify',
                    {
                      wrong: filteredToVerify
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
              className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center ${
                cannotUpdate && 'opacity-50'
              }`}
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
                setSellectedToall(true);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex justify-center items-center"
            >
              <FaCheckDouble className="mr-2" /> Select All
            </button>
            <button
              type="button"
              onClick={() => {
                setSellectedToall(false);
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
