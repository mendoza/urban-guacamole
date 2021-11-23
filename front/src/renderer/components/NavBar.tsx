import { useState } from 'react';
import { useHistory } from 'react-router';

const NavBar = () => {
  const [hidden, setHidden] = useState(true);
  const history = useHistory();
  return (
    <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-blue-600 mb-3">
      <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
        <div className="w-full relative flex justify-between lg:w-auto  px-4 lg:static lg:block lg:justify-start">
          <a
            className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
            href="#pablo"
          >
            Chart Annotation App
          </a>
          <button
            onClick={() => {
              setHidden(!hidden);
            }}
            className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
            type="button"
          >
            <span className="block relative w-6 h-px rounded-sm bg-white" />
            <span className="block relative w-6 h-px rounded-sm bg-white mt-1" />
            <span className="block relative w-6 h-px rounded-sm bg-white mt-1" />
          </button>
        </div>
        <div
          hidden={hidden}
          className="lg:flex flex-grow items-center"
          id="example-navbar-warning"
        >
          <ul className="flex flex-col lg:flex-row list-none ml-auto">
            <li className="nav-item">
              <a
                onClick={() => {
                  window.electron.store.delete('token');
                  window.electron.store.delete('role');
                  history.push('/login');
                }}
                className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                href="#pablo"
              >
                Log out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
