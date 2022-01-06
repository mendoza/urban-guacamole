type PropTypes = {
  currentPage: number;
  setPage: (x: number) => void;
  limit: number;
  extraClassNames?: string;
};

const Pagination = ({
  extraClassNames,
  currentPage,
  setPage,
  limit,
}: PropTypes) => {
  return (
    <div className={`flex flex-col ${extraClassNames}`}>
      <div className="flex text-gray-700">
        <div
          className="h-8 w-8 mr-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => {
            if (currentPage > 1) setPage(currentPage - 1);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-chevron-left w-4 h-4"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </div>
        <div className="flex h-8 font-medium rounded-full bg-gray-200">
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              setPage(1);
            }}
            className="w-8 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in rounded-full  "
          >
            1
          </div>
          <div
            className="w-8 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-full"
            role="button"
            tabIndex={0}
            onClick={() => {
              if (currentPage !== 1) setPage(currentPage - 1);
            }}
          >
            ...
          </div>

          <div className="w-8 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in bg-pink-600 text-white rounded-full  ">
            {currentPage}
          </div>
          <div
            className="w-8 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-full"
            role="button"
            tabIndex={0}
            onClick={() => {
              if (currentPage !== limit) setPage(currentPage + 1);
            }}
          >
            ...
          </div>
          <div
            className="w-8 md:flex justify-center items-center hidden  cursor-pointer leading-5 transition duration-150 ease-in  rounded-full"
            role="button"
            tabIndex={0}
            onClick={() => {
              setPage(limit);
            }}
          >
            {limit}
          </div>
        </div>
        <div
          className="h-8 w-8 ml-1 flex justify-center items-center rounded-full bg-gray-200 cursor-pointer"
          role="button"
          tabIndex={0}
          onClick={() => {
            if (currentPage < limit) setPage(currentPage + 1);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-chevron-right w-4 h-4"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </div>
  );
};

Pagination.defaultProps = {
  extraClassNames: '',
};

export default Pagination;
