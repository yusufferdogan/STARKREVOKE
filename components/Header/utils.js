import { useConnectors, useAccount } from '@starknet-react/core';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Argent from '../../constants/images/argent.svg';
import Bravoos from '../../constants/images/bravoos.svg';
import css from './Header.module.css';

export function OpenModal({ available, connect, connectors }) {
  const [isOpen, setIsOpen] = useState(false);

  function handleOpenModal() {
    setIsOpen(true);
  }

  function handleCloseModal() {
    setIsOpen(false);
  }

  function isWalletAvailable(connector, available) {
    return available.find((obj) => obj.id() === connector) !== undefined;
  }

  function connectToWallet(connector) {
    connect(connector);
    handleCloseModal();
  }
  if (isOpen)
    return (
      <div
        id="popup-modal"
        tabIndex={-1}
        className=" fixed top-0 left-0 right-0 z-50 hidden p-4
         overflow-x-hidden overflow-y-auto md:inset-0
          h-[calc(100%-1rem)] max-h-full"
      >
        <Modal
          appElement={document.getElementById('body')}
          className="fixed z-50 inset-0 overflow-y-auto"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: 'white',
            overlay: {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
            },
          }}
          isOpen={isOpen}
          onRequestClose={handleCloseModal}
          ariaHideApp={false}
          // overlayClassName={css.overlay}
        >
          <div className="flex justify-center items-center flex-col min-h-screen">
            <div className="relative rounded-lg shadow bg bg-zinc-900">
              <button
                type="button"
                className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
                data-modal-hide="popup-modal"
                onClick={handleCloseModal}
              >
                <svg
                  aria-hidden="true"
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
              <button className="h-1"></button>

              <div className="py-6 px-10 mx-20 my-10 text-center">
                <div className="flex flex-col gap-4 w-max">
                  <button
                    data-modal-hide="popup-modal"
                    type="button"
                    className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none
                    focus:ring-gray-600 rounded-lg border border-gray-900 text-md font-medium px-5 py-2.5 shadow-md
                     hover:text-white focus:z-10"
                    onClick={() => connectToWallet(connectors[0])}
                  >
                    <div className="flex flex-row items-center gap-4">
                      <Image
                        src={Bravoos}
                        alt="My SVG"
                        width={50}
                        height={50}
                        className="px-10"
                      />
                      <p>
                        {isWalletAvailable('bravoos', available)
                          ? 'Connect to Bravoos'
                          : 'Install Bravoos'}
                      </p>
                    </div>
                  </button>
                  <button
                    data-modal-hide="popup-modal"
                    type="button"
                    className="text-white bg-gray-500 hover:bg-gray-600 focus:ring-4 focus:outline-none
                     focus:ring-gray-600 rounded-lg border border-gray-900 text-md font-medium px-5 py-2.5 shadow-md
                      hover:text-white focus:z-10"
                    onClick={() => connectToWallet(connectors[1])}
                  >
                    <div className="flex flex-row items-center gap-4 w-max">
                      <Image
                        src={Argent}
                        alt="My SVG"
                        width={50}
                        height={50}
                        className="px-10"
                      />
                      <p>
                        {isWalletAvailable('argentX', available)
                          ? 'Connect to argentX'
                          : 'Install argentX'}
                      </p>
                      <div className="pl-10"></div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  else return <Button onClick={handleOpenModal}></Button>;
}
//
export function Button({ key, text, onClick }) {
  return (
    <button
      key="{key}"
      type="button"
      className="bg-white hover:bg-gray-200
       text-gray-800 focus:ring-4 focus:outline-none
         font-medium rounded-lg text-xs 
         px-3 py-2 text-center"
      onClick={onClick}
    >
      Connect Wallet
    </button>
  );
}
export function ConnectWallet() {
  const { connect, connectors, disconnect, available, refresh } =
    useConnectors();
  const { account, address, status } = useAccount();

  useEffect(() => {
    // refresh all available connectors every 5 seconds
    const interval = setInterval(refresh, 1000);
    return () => clearInterval(interval);
  }, [refresh, connect]);

  if (status === 'connected') {
    return (
      <button
        type="button"
        className="text-black bg-white hover:bg-gray-200 focus:ring-4 
        focus:outline-none focus:ring-emerald-900 shadow-lg
         shadow-gray-400/50 dark:shadow-lg dark:shadow-gray-800/80 
         font-medium rounded-lg text-sm text-center mt-2 p-2"
        onClick={() => {
          navigator.clipboard.writeText(address);
          toast.success('Address Copied', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'dark',
          });
        }}
      >
        {address.substring(0, 4) +
          '..' +
          address.substring(address.length - 4, address.length)}
      </button>
    );
  } else
    return (
      <OpenModal
        available={available}
        connectors={connectors}
        connect={connect}
      ></OpenModal>
    );
}
