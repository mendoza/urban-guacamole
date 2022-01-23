import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { chartTypes } from '../utils/Constants';
import NavBar from '../components/NavBar';
import api from '../utils/api';

const AssignAnnotation = () => {
  const [annotators, setAnnotators] = useState<Array<any>>([]);
  const [selectedAnnotator, setSelectedAnnotator] = useState('-1');
  const [available, setAvailable] = useState(0);
  const [amount, setAmount] = useState<number>(1);
  const [difficulty, setDifficulty] = useState('easy');
  const [type, setType] = useState('any');
  const [panels, setPanels] = useState('any');
  const [contains, setContains] = useState('any');

  useEffect(() => {
    const asyncGet = async () => {
      try {
        const { data } = await api.get('admin/users', {
          headers: {
            authorization: window.electron.store.get('token'),
          },
        });
        setAnnotators(data.users);
      } catch (error) {
        toast.error('Error getting annotators!');
      }
    };
    asyncGet();
  }, []);

  useEffect(() => {
    const asyncGet = async () => {
      try {
        const { data } = await api.get('admin/available', {
          headers: {
            authorization: window.electron.store.get('token'),
          },
        });
        setAvailable(data.available);
      } catch (error) {
        toast.error('Error getting available images!');
      }
    };
    asyncGet();
  }, []);

  return (
    <>
      <NavBar />
      <div className="flex w-full h-full">
        <div className="flex w-full justify-center items-center mx-8">
          <div className="flex flex-col py-4 px-8 bg-white shadow-lg rounded-lg w-full">
            <div className="flex flex-row">
              <h3 className="text-4xl font-normal leading-normal mt-0 mb-2 text-blue-800">
                Assign Annotation - There&apos;s still are{' '}
                {available.toLocaleString('en-US')} images
              </h3>
            </div>
            <form
              className="grid grid-cols-2 gap-4"
              onSubmit={async (e) => {
                e.preventDefault();
                e.persist();
                try {
                  const { data } = await api.post(
                    'admin/assign',
                    {
                      limit: amount,
                      who: selectedAnnotator,
                      difficulty,
                      type:
                        panels === 'multiple' ||
                        contains === 'no' ||
                        contains === 'any'
                          ? 'any'
                          : type,
                      panels,
                      contains,
                    },
                    {
                      headers: {
                        authorization: window.electron.store.get('token'),
                      },
                    }
                  );
                  const assigned = data.confirm.insertedIds.length || 0;
                  toast.success(
                    `Successfully assigned ${assigned} images to the annotator!`
                  );
                  setAvailable((prev) => prev - assigned);
                } catch (error) {
                  toast.error('Error assigning to the annotator!');
                }
              }}
            >
              <div className="">
                <label className="block" htmlFor="annotator">
                  Selected Annotator
                  <select
                    required
                    value={selectedAnnotator}
                    onChange={(e) => {
                      setSelectedAnnotator(e.currentTarget.value);
                    }}
                    id="annotator"
                    placeholder="Email"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option disabled value={-1}>
                      Select Annotator
                    </option>
                    {annotators.map((annotator) => {
                      return (
                        <option key={annotator._id} value={annotator._id}>
                          {annotator.name}
                        </option>
                      );
                    })}
                  </select>
                </label>
              </div>
              <div className="">
                <label className="block" htmlFor="difficulty">
                  Difficulty
                  <select
                    required
                    value={difficulty}
                    onChange={(e) => {
                      setDifficulty(e.currentTarget.value);
                    }}
                    id="difficulty"
                    placeholder="Amount of images"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="easy">Easy</option>
                    <option value="hard">Hard</option>
                  </select>
                </label>
              </div>
              <div>
                <label className="block" htmlFor="amount">
                  How many images
                  <input
                    required
                    type="amount"
                    min={1}
                    max={available}
                    value={amount}
                    onChange={(e) => {
                      setAmount(Number(e.currentTarget.value));
                    }}
                    id="email"
                    placeholder="Amount of images"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  />
                </label>
              </div>
              <div>
                <label className="block" htmlFor="panels">
                  Panels
                  <select
                    required
                    value={panels}
                    onChange={(e) => {
                      setPanels(e.currentTarget.value);
                    }}
                    id="panels"
                    placeholder="Amount of images"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="any">Any</option>
                    <option value="single">Single</option>
                    <option value="multiple">Multiple</option>
                  </select>
                </label>
              </div>
              <div>
                <label className="block" htmlFor="contains">
                  Contains chart
                  <select
                    required
                    value={contains}
                    onChange={(e) => {
                      setContains(e.currentTarget.value);
                    }}
                    id="contains"
                    placeholder="Amount of images"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="any">Any</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </label>
              </div>
              <div
                hidden={
                  panels === 'multiple' ||
                  contains === 'no' ||
                  contains === 'any'
                }
              >
                <label className="block" htmlFor="type">
                  Type of chart
                  <select
                    required
                    value={type}
                    onChange={(e) => {
                      setType(e.currentTarget.value);
                    }}
                    id="type"
                    placeholder="Amount of images"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="any">Any</option>
                    {chartTypes.map((tipo, idx) => {
                      return (
                        <option key={`chart-type-${idx}}`} value={tipo}>
                          {tipo}
                        </option>
                      );
                    })}
                  </select>
                </label>
              </div>
              <div className="col-span-2 flex items-baseline justify-around">
                <button
                  type="submit"
                  className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                  hidden={available === 0 || selectedAnnotator === '-1'}
                >
                  Assign annotations
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignAnnotation;
