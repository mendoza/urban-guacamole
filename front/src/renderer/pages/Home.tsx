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

const Home = () => {
  return (
    <div className="flex w-full min-h-screen">
      <div className="flex xl:w-3/4 w-1/2 justify-center items-center">
        <div className="flex justify-center items-center py-4 px-8 bg-white shadow-lg rounded-lg my-20 xl:h-5/6 w-full">
          <img
            className="object-contain h-auto xl:w-3/6 w-full"
            src="http://localhost:3001/img/PMC1618809/PMC1618809___1.jpg"
            alt="test chart"
          />
        </div>
      </div>
      <div className="flex justify-center items-center xl:w-1/4 w-1/2">
        <div className="py-4 px-8 bg-white shadow-lg rounded-lg my-20 ">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              e.persist();
            }}
          >
            <h3 className="text-xl font-bold text-center">
              Please select the type of image
            </h3>
            <div className="mt-4" />
            <fieldset id="panels" className="flex justify-around">
              <label htmlFor="panels">
                <input type="radio" name="panels" value="single" /> Single Panel
              </label>
              <label htmlFor="choice">
                <input type="radio" name="panels" value="multiple" /> Multiple
                Panel
              </label>
            </fieldset>

            <div className="mt-4" />

            <h3 className="text-xl font-bold text-center">
              Does it contains at least one chart?
            </h3>
            <div className="mt-4" />
            <fieldset id="chart" className="flex justify-around">
              <label htmlFor="chart">
                <input type="radio" name="chart" value="yes" /> Yes
              </label>
              <label htmlFor="chart">
                <input type="radio" name="chart" value="no" /> No
              </label>
            </fieldset>

            <div className="mt-4" />

            <h3 className="text-xl font-bold text-center">
              What type of chart is it?
            </h3>
            <div className="mt-4" />
            <div className="flex justify-around">
              <select>
                {chartType.map((item, index) => {
                  return <option value={index - 1}>{item}</option>;
                })}
              </select>
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
  );
};

export default Home;
