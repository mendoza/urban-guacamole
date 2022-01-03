import { useEffect, useRef, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import NavBar from '../components/NavBar';
import api from '../utils/api';

const DownloadData = () => {
  const [downloadLink, setDownloadLink] = useState('');
  const download = useRef();
  useEffect(() => {
    const asyncGet = async () => {
      const { data } = await api.get('/admin', {
        headers: {
          authorization: window.electron.store.get('token'),
        },
      });
      const downloadData = new Blob([JSON.stringify(data)], {
        type: 'text/json',
      });

      if (downloadLink !== '') window.URL.revokeObjectURL(downloadLink);

      setDownloadLink(window.URL.createObjectURL(downloadData));
    };
    asyncGet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <NavBar />
      <div className="flex w-full h-full">
        <div className="flex w-full justify-center items-center mx-8">
          <div className="flex flex-col py-4 px-8 bg-white shadow-lg rounded-lg w-full">
            <div className="flex flex-row">
              <h3 className="text-4xl font-normal leading-normal mt-0 mb-2 text-blue-800">
                Download Annotated Data
              </h3>
            </div>
            <div className="flex justify-center items-center">
              <button
                type="button"
                onClick={() => {
                  if (download !== undefined) {
                    download.current.click();
                  }
                }}
                className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900 flex items-center justify-center w-1/2"
              >
                <FaDownload className="mr-4 h-10 w-10" />
                <p className="text-lg">Download</p>
                <a
                  hidden
                  download={`${new Date().toISOString()}.json`}
                  href={downloadLink}
                  ref={download}
                >
                  Download
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadData;
