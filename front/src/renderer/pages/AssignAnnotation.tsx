import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import NavBar from '../components/NavBar';
import api from '../utils/api';

const AssignAnnotation = () => {
  const [annotators, setAnnotators] = useState<Array<any>>([]);
  const [selectedAnnotator, setSelectedAnnotator] = useState('-1');
  const [available, setAvailable] = useState(0);
  const [amount, setAmount] = useState<number>(1);
  const [difficulty, setDifficulty] = useState('easy');
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

  useEffect(() => {
    const asyncGet = async () => {
      try {
        const { data: dataAvailable } = await api.get('admin/available', {
          headers: {
            authorization: window.electron.store.get('token'),
          },
        });
        setAvailable(dataAvailable.available);

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
                  await api.post(
                    'admin/assign',
                    {
                      limit: amount,
                      who: selectedAnnotator,
                      difficulty,
                    },
                    {
                      headers: {
                        authorization: window.electron.store.get('token'),
                      },
                    }
                  );
                  toast.success('Assigned successfully to the annotator!');
                } catch (error) {
                  toast.error('Error assigning to the annotator!');
                }
              }}
            >
              <div className="">
                <label className="block" htmlFor="email">
                  Selected Annotator
                  <select
                    required
                    value={selectedAnnotator}
                    onChange={(e) => {
                      setSelectedAnnotator(e.currentTarget.value);
                    }}
                    id="email"
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
                <label className="block" htmlFor="email">
                  Difficulty
                  <select
                    required
                    value={difficulty}
                    onChange={(e) => {
                      setDifficulty(e.currentTarget.value);
                    }}
                    id="email"
                    placeholder="Amount of images"
                    className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="easy">Easy</option>
                    <option value="hard">Hard</option>
                  </select>
                </label>
              </div>
              <div className="col-span-2">
                <label className="block" htmlFor="email">
                  How many images
                  <input
                    required
                    type="number"
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
              <div className="col-span-2 flex items-baseline justify-around">
                <button
                  type="submit"
                  className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900"
                  hidden={available === 0}
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
