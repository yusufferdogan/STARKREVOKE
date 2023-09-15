import { React, useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { ListItemERC20 } from './listItem';
import { ListItemERC721 } from './listItemErc721';
import { IoLogoGithub } from 'react-icons/io';
import { Loader } from './utils';
import { connect } from '@argent/get-starknet';
import { RpcProvider, CallData, cairo } from 'starknet';
require('dotenv').config();
function Home() {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [erc20map, setERC20map] = useState({});
  const [erc721map, setERC721map] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState({});

  const updateSelected = (key) => {
    setSelected((prevMap) => ({
      ...prevMap,
      [key]: !prevMap[key],
    }));
  };

  async function sendTx() {
    try {
      const starknet = await connect({ showList: false });

      await starknet.enable();

      const provider = new RpcProvider({
        nodeUrl: process.env.ALCHEMY_URL,
      });

      const transactions = [];

      for (const key in erc20map) {
        if (erc20map.hasOwnProperty(key) && selected[key]) {
          const transaction = erc20map[key].transaction;
          console.log(transaction);

          transactions.push({
            contractAddress: transaction.contract_address,
            entrypoint: 'approve',
            calldata: CallData.compile({
              spender: transaction.spender,
              amount: cairo.uint256(0n),
            }),
          });
        }
      }

      for (const key in erc721map) {
        if (erc721map.hasOwnProperty(key) && selected[key]) {
          const transaction = erc721map[key];
          console.log(transaction);

          transactions.push({
            contractAddress: transaction.contract_address,
            entrypoint: 'setApprovalForAll',
            calldata: CallData.compile({
              operator: transaction.spender,
              approved: cairo.felt(0n),
            }),
          });
        }
      }

      const result = await starknet.account.execute(transactions);
      provider.account
        .waitForTransaction(result.transaction_hash)
        .then((receipt) => {
          console.log(receipt);
        })
        .catch((error) => {
          console.error('Error waiting for transaction:', error);
        });
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    const fetchData = async (addr) => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/transactions?id=${addr}`);
        if (!response.ok) {
          throw new Error('Request failed');
        }
        const data = await response.json();
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

  console.log(selected);
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
                  <button
                    onClick={sendTx}
                    disabled={
                      Object.values(selected).filter((value) => value === true)
                        .length === 0
                    }
                    type="button"
                    className={`focus:outline-none text-white ${
                      Object.values(selected).filter((value) => value === true)
                        .length === 0
                        ? 'bg-gray-300 text-black text-sm px-5 py-2.5 mr-2 mb-2'
                        : 'bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900'
                    } font-medium rounded-lg`}
                  >
                    REVOKE ALL
                  </button>
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
                    id={key}
                    transaction={value.transaction}
                    allowance={value.allowance}
                    toggle={updateSelected}
                    selected={selected[key] || false}
                  ></ListItemERC20>
                ))}
                {Object.entries(erc721map).map(([key, value]) => (
                  <ListItemERC721
                    id={key}
                    key={key}
                    transaction={value}
                    toggle={updateSelected}
                    selected={selected[key] || false}
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
          href="https://github.com/yusufferdogan/STARKREVOKE"
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
