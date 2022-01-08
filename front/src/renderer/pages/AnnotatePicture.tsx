import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { FaSadTear } from 'react-icons/fa';

import Pagination from '../components/Pagination';
import NavBar from '../components/NavBar';
import api from '../utils/api';
import { chartType } from '../utils/Constants';

const pageSize = 1;

const Annotate = () => {
  const [panels, setPanels] = useState('');
  const [containsChart, setContainsChart] = useState(false);
  const [typeOfChart, setTypeOfChart] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentImage, setCurrentImage] = useState<any>({});
  const [lastPage, setLastPage] = useState(1);
  const [images, setImages] = useState<Array<any>>([]);
  useEffect(() => {
    const asyncGet = async () => {
      const { data } = await api.get('annotation/', {
        headers: {
          authorization: window.electron.store.get('token'),
        },
      });
      const { items } = data;

      setImages(items);
      setLastPage(Math.ceil(items.length / pageSize));
    };
    asyncGet();
  }, []);

  useEffect(() => {
    setCurrentImage(images[currentPage - 1]);
  }, [currentPage, images]);

  useEffect(() => {
    setLastPage(Math.ceil(images.length / pageSize));
  }, [images.length]);

  useEffect(() => {
    const item = images[currentPage - 1] || {};
    setCurrentImage(item);
    setPanels(item?.annotation?.prePanels);
    setContainsChart(item?.annotation?.preContainsChart);
    setTypeOfChart(item?.annotation?.preTypeOfChart);
  }, [currentPage, images]);

  const removeItem = useCallback(
    (current) => {
      const index = images.findIndex(
        (item) => item?.annotation?.path === current?.annotation?.path
      );
      if (index !== -1) {
        const aux = [...images];
        aux.splice(index, 1);
        setImages(aux);
        setCurrentPage(currentPage + (index !== 0 ? -1 : 1));
      }
    },
    [currentPage, images]
  );
  return (
    <>
      <NavBar />
      {images.length !== 0 ? (
        <>
          <div className="py-4 px-8 mx-4 bg-white shadow-lg rounded-lg ">
            <Pagination
              extraClassNames="items-center"
              setPage={setCurrentPage}
              currentPage={currentPage}
              limit={lastPage}
            />
          </div>
          <div className="flex w-full h-full">
            <div className="flex w-1/2 justify-center items-center mx-8">
              <div className="flex flex-col justify-center items-center py-4 px-8 bg-white shadow-lg rounded-lg my-20 xl:h-5/6 w-full">
                <img
                  loading="lazy"
                  className="object-contain h-auto xl:w-5/6 w-full"
                  src={`${window.electron.store.get('endpoint')}img/${
                    currentImage?.annotation?.path
                  }`}
                  alt={currentImage?.annotation?.path}
                />
                <h2 className="mt-4 font-bold">
                  {currentImage?.annotation?.path}
                </h2>
              </div>
            </div>
            <div className="flex justify-center items-center w-1/2">
              <div className="py-4 px-8 bg-white shadow-lg rounded-lg my-20 ">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    e.persist();
                    try {
                      const payload: any = {
                        panels,
                        containsChart,
                        path: currentImage?.annotation?.path,
                      };
                      if (containsChart && panels === 'single') {
                        payload.chartType = typeOfChart;
                      }
                      await api.post(
                        '/annotation/annotate',
                        {
                          ...payload,
                        },
                        {
                          headers: {
                            authorization: window.electron.store.get('token'),
                          },
                        }
                      );
                      removeItem(currentImage);
                      toast.success('Annotated Successfully!');
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  <h3 className="text-xl font-bold text-center">
                    Please select the type of image
                  </h3>
                  <div className="mt-4" />
                  <fieldset id="panels" className="flex justify-around">
                    <label htmlFor="single">
                      <input
                        required
                        type="radio"
                        name="panels"
                        id="single"
                        checked={panels === 'single'}
                        onChange={() => {
                          setPanels('single');
                        }}
                      />
                      Single Panel
                    </label>
                    <label htmlFor="multiple">
                      <input
                        type="radio"
                        name="panels"
                        id="multiple"
                        checked={panels === 'multiple'}
                        onChange={() => {
                          setPanels('multiple');
                        }}
                      />
                      Multiple Panel
                    </label>
                  </fieldset>
                  <div>
                    <div className="mt-4" />
                    <h3 className="text-xl font-bold text-center">
                      Does it contains at least one chart?
                    </h3>
                    <div className="mt-4" />
                    <fieldset
                      id="contains-chart"
                      className="flex justify-around"
                    >
                      <label htmlFor="chart">
                        <input
                          id="chart"
                          type="radio"
                          name="contains-chart"
                          value="yes"
                          required={panels === 'single'}
                          checked={containsChart}
                          onChange={() => {
                            setContainsChart(true);
                          }}
                        />
                        Yes
                      </label>
                      <label htmlFor="no-chart">
                        <input
                          id="no-chart"
                          type="radio"
                          name="contains-chart"
                          value="no"
                          checked={!containsChart}
                          onChange={() => {
                            setContainsChart(false);
                          }}
                        />
                        No
                      </label>
                    </fieldset>

                    <div hidden={panels === 'multiple' || !containsChart}>
                      <div className="mt-4" />

                      <h3 className="text-xl font-bold text-center">
                        What type of chart is it?
                      </h3>
                      <div className="mt-4" />
                      <div className="flex justify-around">
                        <select
                          required={panels !== 'multiple' && containsChart}
                          value={typeOfChart}
                          onChange={(e) => {
                            setTypeOfChart(e.target.value);
                          }}
                        >
                          <option disabled value={-2}>
                            Select a type of chart
                          </option>
                          {chartType.map((item, index) => {
                            return (
                              // eslint-disable-next-line react/no-array-index-key
                              <option key={`chartype-${index}`} value={item}>
                                {item}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-around">
                    <button
                      type="submit"
                      className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                    >
                      Annotate
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="w-full h-full grid grid-cols-2">
          <div className="grid place-items-center">
            <FaSadTear className="w-1/3 h-auto" />
          </div>
          <div className="grid place-items-center">
            <h2 className="text-5xl font-normal leading-normal mt-0 mb-2 text-black-800">
              Looks like you don&apos;t anything else to annotate.
            </h2>
          </div>
        </div>
      )}
    </>
  );
};

export default Annotate;
