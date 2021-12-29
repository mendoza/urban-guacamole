import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';

import NavBar from '../components/NavBar';
import api from '../utils/api';

const chartType = [
  'Unknown',
  'Bar (Horizontal)',
  'Bar (Vertical)',
  'Box (Horizontal)',
  'Box (Vertical)',
  'Pie',
  'Line',
  'Scatter',
  'Scatter With Line',
  'Area',
  'Heatmap',
  'Interval (Horizontal)',
  'Interval (Vertical)',
  'Manhattan',
  'Map',
  'Surface',
  'Venn',
];
const pageSize = 1;

const Annotate = () => {
  const [panels, setPanels] = useState('');
  const [containsChart, setContainsChart] = useState(false);
  const [typeOfChart, setTypeOfChart] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentImage, setCurrentImage] = useState<any>({});
  const [lastPage, setLastPage] = useState(1);
  const [images, setImages] = useState([]);
  useEffect(() => {
    const asyncGet = async () => {
      const { data } = await api.get('annotation/', {
        headers: {
          authorization: window.electron.store.get('token'),
        },
      });
      const { items } = data;
      const item = items[0] || {};
      setCurrentImage(item);
      if (item.prePanels) setPanels(item.prePanels);
      if (item.preContainsChart) setContainsChart(item.preContainsChart);
      if (item.preTypeOfChart) setTypeOfChart(item.preTypeOfChart);
      setImages(items);
      setLastPage(Math.ceil(images.length / pageSize));
    };
    asyncGet();
  }, [images.length]);

  useEffect(() => {
    console.log(currentImage);
  }, [currentImage]);

  return (
    <>
      <NavBar />
      <div className="py-4 px-8 mx-4 bg-white shadow-lg rounded-lg">
        <div className="flex flex-row items-center">
          <button
            className="text-blue-500 bg-transparent border-l border-t border-b border-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded-l outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
            type="button"
            disabled={currentPage === 1}
            onClick={() => {
              if (currentPage !== 1) setCurrentPage(currentPage - 1);
            }}
          >
            <FaChevronLeft />
          </button>
          <button
            disabled
            className="text-blue-500 bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            {`${currentPage}`}
          </button>
          <button
            disabled
            className="text-blue-500 bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            ...
          </button>
          <button
            disabled
            className="text-blue-500 bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
            type="button"
          >
            {`${lastPage}`}
          </button>
          <button
            className="text-blue-500 bg-transparent border-r border-t border-b border-blue-500 hover:bg-blue-500 hover:text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded-r outline-none focus:outline-none mb-1 ease-linear transition-all duration-150"
            type="button"
            disabled={currentPage === lastPage}
            onClick={() => {
              setCurrentPage(currentPage + 1);
            }}
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
      <div className="flex w-full h-full">
        <div className="flex w-1/2 justify-center items-center mx-8">
          <div className="flex justify-center items-center py-4 px-8 bg-white shadow-lg rounded-lg my-20 xl:h-5/6 w-full">
            <img
              loading="lazy"
              className="object-contain h-auto xl:w-5/6 w-full"
              src={`${process.env.API_URL}img/${currentImage.path}`}
              alt={currentImage.path}
            />
          </div>
        </div>
        <div className="flex justify-center items-center w-1/2">
          <div className="py-4 px-8 bg-white shadow-lg rounded-lg my-20 ">
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.persist();
                try {
                  await api.post(
                    '/annotation/annotate',
                    {
                      panels,
                      containsChart,
                      chartType: typeOfChart,
                      path: currentImage.path,
                    },
                    {
                      headers: {
                        authorization: window.electron.store.get('token'),
                      },
                    }
                  );
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
              <div hidden={panels === 'multiple' || panels === ''}>
                <div className="mt-4" />

                <h3 className="text-xl font-bold text-center">
                  Does it contains at least one chart?
                </h3>
                <div className="mt-4" />
                <fieldset id="contains-chart" className="flex justify-around">
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

                <div hidden={!containsChart}>
                  <div className="mt-4" />

                  <h3 className="text-xl font-bold text-center">
                    What type of chart is it?
                  </h3>
                  <div className="mt-4" />
                  <div className="flex justify-around">
                    <select
                      required={panels === 'single' && containsChart}
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
  );
};

export default Annotate;
