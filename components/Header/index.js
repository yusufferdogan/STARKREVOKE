import React from 'react';
import Link from 'next/link';
import { ConnectWallet } from './utils';
import Image from 'next/image';
import Logo from '../../constants/images/logo.svg';

function Header() {
  return (
    <header aria-label="Site Header">
      <div className="mx-auto max-w-screen-3xl px-4 sm:px-6 lg:px-8 items-center pb-10">
        <div className="flex h-16 items-center justify-between">
          <div className="md:flex md:items-center md:gap-12">
            <Link href="/">
              <div className="block text-white font-extrabold text-3xl">
                <span className="sr-only">Home</span>
                <p className='pl-10'>Revoke Starknet</p>
              </div>
            </Link>
          </div>
          {/* <div className="hidden md:block">
            <nav aria-label="Site Nav">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <Link
                    className="text-gray-500 transition hover:text-gray-500/75"
                    href="/#about"
                  >
                    TAB1
                  </Link>
                </li>{' '}
                <li>
                  <Link
                    className="text-gray-500 transition hover:text-gray-500/75"
                    href="/#about"
                  >
                    TAB2
                  </Link>
                </li>{' '}
                <li>
                  <Link
                    className="text-gray-500 transition hover:text-gray-500/75"
                    href="/#about"
                  >
                    TAB3
                  </Link>
                </li>{' '}
                <li>
                  <Link
                    className="text-gray-500 transition hover:text-gray-500/75"
                    href="/#about"
                  >
                    TAB4
                  </Link>
                </li>
              </ul>
            </nav>
          </div> */}
          <div className="flex items-center">
            <div className="pr-10">
              <ConnectWallet></ConnectWallet>
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
