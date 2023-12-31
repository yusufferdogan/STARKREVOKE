import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import { connect, disconnect } from '@argent/get-starknet';
import styles from './Header.module.css';
function Header() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  useEffect(() => {
    const isConnected = sessionStorage.getItem('connected') === 'true';
    const savedAddress = sessionStorage.getItem('address');
    if (isConnected && savedAddress) {
      setConnected(true);
      setAddress(savedAddress);
    }
  }, []);

  const connectWallet = async () => {
    try {
      const connection = await connect();
      if (connection && connection.isConnected) {
        setConnected(true);
        setAddress(connection.selectedAddress);
        sessionStorage.setItem('connected', 'true');
        sessionStorage.setItem('address', connection.selectedAddress);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
      sessionStorage.removeItem('connected');
      sessionStorage.removeItem('address');
      setConnected(false);
      setAddress('');
    } catch (error) {
      console.error('Failed to disconnect wallet:', error);
    }
  };

  const handleConnectButton = () => {
    if (connected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  return (
    <header aria-label="Site Header">
      <ToastContainer autoClose={false} draggable={false} />
      <div className="mx-auto max-w-screen-3xl px-4 sm:px-6 lg:px-8 items-center pb-10">
        <div className="flex h-16 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <Link href="/">
              <div className="block text-white font-extrabold items-center">
                <span className="sr-only">Home</span>
                <Image
                  src={'/logo.png'}
                  alt=""
                  width={450}
                  height={150}
                ></Image>
              </div>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="pr-10">
              {connected ? (
                <div>
                  <button
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className={styles.myButton0}
                    onClick={disconnectWallet}
                  >
                    {isHovered
                      ? 'DISCONNECT'
                      : address.substring(0, 6) +
                        '..' +
                        address.substring(address.length - 4, address.length)}
                  </button>
                </div>
              ) : (
                <button className={styles.myButton} onClick={connectWallet}>
                  CONNECT
                </button>
              )}
            </div>
          </div>
          <div className="block md:hidden">
            <button
              className="rounded bg-gray-100 p-2
             text-gray-600 transition hover:text-gray-600/75"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
