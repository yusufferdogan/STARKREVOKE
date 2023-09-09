import { React, useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { ListItemERC20 } from './listItem';
import { ListItemERC721 } from './listItemErc721';
import { IoLogoGithub } from 'react-icons/io';
import { Loader } from './utils';
function Home() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [erc20map, setERC20map] = useState({});
  const [erc721map, setERC721map] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async (addr) => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/transactions?id=${addr}`);
        if (!response.ok) {
          throw new Error('Request failed');
        }
        const data = await response.json();
        // sessionStorage.setItem('erc20', data.erc20);
        // sessionStorage.setItem('er721', data.erc721);
        setERC20map(data.erc20);
        setERC721map(data.erc721);
        setIsLoading(false);
        return data;
      } catch (error) {
        alert('An Error occurred ,Please refresh the page');
        console.log('Error fetching data: ' + error.message);
        // throw new Error('Error fetching data: ' + error.message);
      }
    };

    setInterval(function () {
      if (sessionStorage.getItem('connected') !== 'true') {
        setConnected(false);
        setAddress('');
        setERC20map({});
        setERC721map({});
      } else {
        if (sessionStorage.getItem('connected') === 'true') {
          const savedAddress = sessionStorage.getItem('address');
          setConnected(true);
          setAddress(savedAddress);
        }
      }
    }, 1000);

    // Call fetchData only when the component first mounts
    if (address !== '' && connected) {
      fetchData(address);
    }
  }, [address, connected]);

  return (
    <div className="min-w-full">
      <div className="overflow-y-scroll" style={{ maxHeight: '79vh' }}>
        <div
          className="relative overflow-x-auto shadow-md 
        sm:rounded-lg border mx-20 rounded-lg"
        >
          <table
            className="w-full text-sm text-left
           "
          >
            <thead
              className="font-bold text-white uppercase
             "
            >
              <tr className="border-b">
                <th scope="col" className="px-6 py-3 ">
                  Asset
                </th>
                <th scope="col" className="px-6 py-3">
                  Allowance
                </th>
                <th scope="col" className="px-6 py-3">
                  Spender
                </th>{' '}
                <th scope="col" className="px-6 py-3">
                  Last Updated
                </th>{' '}
                <th scope="col" className="px-6 py-3">
                  Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            {isLoading ? (
              <Loader></Loader>
            ) : connected &&
              Object.entries(erc20map).length === 0 &&
              Object.entries(erc721map).length === 0 ? (
              <tbody>
                <p className="p-5">NO ALLOWANCE EXISTS</p>
              </tbody>
            ) : (
              <tbody className="">
                {Object.entries(erc20map).map(([key, value]) => (
                  <ListItemERC20
                    key={key}
                    transaction={value.transaction}
                    allowance={value.allowance}
                  ></ListItemERC20>
                ))}
                {Object.entries(erc721map).map(([key, value]) => (
                  <ListItemERC721
                    key={key}
                    transaction={value}
                  ></ListItemERC721>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
      <nav
        className="bottom-0 inset-x-0 flex
       justify-center text-sm uppercase font-mono align-middle"
      >
        <a
          className="text-white transition hover:text-gray-500/75"
          href="https://github.com/yusufferdogan/REVOKE-STARKNET"
        >
          <div className="group relative m-4 flex justify-center">
            <button
              className="rounded px-4 py-2 text-sm
                       text-white shadow-sm"
            >
              <IoLogoGithub className="text-5xl" />
            </button>
            <span
              className="absolute bottom-16 scale-0 rounded bg-gray-800
                       p-2 text-xs text-white group-hover:scale-100 text-left w-32"
            >
              ✨ Github Repo Contributons are welcomed
            </span>
          </div>
        </a>
        <div className="justify-center mt-10 pl-10 font-mono">
          Made by &nbsp;
          <span>
            <a
              className="text-blue-500 font-bold font-mono text-lg"
              href="https://github.com/yusufferdogan"
            >
              Yusuf Erdogan
            </a>
          </span>
        </div>
      </nav>
    </div>
  );
}

export default Home;
