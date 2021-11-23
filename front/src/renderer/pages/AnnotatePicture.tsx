import { useState } from 'react';
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

const Annotate = () => {
  const [panels, setPanels] = useState('');
  const [containsChart, setContainsChart] = useState(false);
  const [typeOfChart, setTypeOfChart] = useState(0);
  const [path] = useState('PMC1618809/PMC1618809___1.jpg');
  return (
    <>
      <NavBar />
      <div className="flex w-full h-full">
        <div className="flex w-1/2 justify-center items-center mx-8">
          <div className="flex justify-center items-center py-4 px-8 bg-white shadow-lg rounded-lg my-20 xl:h-5/6 w-full">
            <img
              className="object-contain h-auto xl:w-5/6 w-full"
              src={`http://localhost:3001/img/${path}`}
              alt="test chart"
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
                  const { data } = await api.post(
                    '/annotation/annotate',
                    {
                      panels,
                      containsChart,
                      chartType: chartType[typeOfChart + 1],
                      path,
                    },
                    {
                      headers: {
                        authorization: window.electron.store.get('token'),
                      },
                    }
                  );
                  console.log(data);
                } catch (error) {
                  console.log(error);
                }
                console.log('submitted :v');
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
                      onChange={(e) => {
                        setTypeOfChart(parseInt(e.target.value, 10));
                      }}
                      defaultValue={-2}
                    >
                      <option disabled value={-2}>
                        Select a type of chart
                      </option>
                      {chartType.map((item, index) => {
                        return (
                          // eslint-disable-next-line react/no-array-index-key
                          <option key={`chartype-${index}`} value={index - 1}>
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
