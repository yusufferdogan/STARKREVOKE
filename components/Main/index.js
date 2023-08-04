import { React, useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import MyFooter from '../Footer';
import {
  useConnectors,
  useAccount,
  useContractRead,
  useBalance,
} from '@starknet-react/core';
import { ListItemERC20 } from './listItem';
import { ListItemERC721 } from './listItemErc721';
import { IoLogoGithub } from 'react-icons/io';

require('dotenv').config();
function Home() {
  const { account, address, status } = useAccount();
  const [isLoaded, setIsLoaded] = useState(false);
  //erc20 data
  const [erc20Map, setErc20Map] = useState({});
  const [loading, setIsLoading] = useState(false);
  const updateErc20Map = (key, value) => {
    setErc20Map((prevMap) => ({
      ...prevMap,
      [key]: value,
    }));
  };
  //erc721 data
  const [erc721Map, setErc721Map] = useState({});
  const updateErc721Map = (key, value) => {
    setErc721Map((prevMap) => ({
      ...prevMap,
      [key]: value,
    }));
  };
  useEffect(() => {
    async function filterAddresses(transactions) {
      for (let i = 0; i < transactions.length; i++) {
        const element = transactions[i];
        if (element.account_calls.length > 0) {
          for (let j = 0; j < element.account_calls.length; j++) {
            const account_call = element.account_calls[j];
            if (account_call.selector_name === 'approve') {
              // if result is 0x1 it means true and it is erc20 approve
              if (
                account_call.result.length > 0 &&
                account_call.result[0] === '0x1'
              ) {
                const obj = {
                  transaction_hash: account_call.transaction_hash,
                  spender: account_call.calldata[0],
                  amount: {
                    low: account_call.calldata[1],
                    high: account_call.calldata[2],
                  },
                  timestamp: account_call.timestamp,
                  contract_address: account_call.contract_address,
                  blockNumber: account_call.block_number,
                };
                updateErc20Map(obj.contract_address.concat(obj.spender), obj);
              }
              // else {
              //   //TODO: SPENDER != ADDRESS(0)
              //   const obj = {
              //     transaction_hash: account_call.transaction_hash,
              //     spender: account_call.calldata[0],
              //     tokenId: account_call.calldata[1],
              //     timestamp: account_call.timestamp,
              //     contract_address: account_call.contract_address,
              //     isSetApprovalForAll: false,
              //     name: null,
              //     symbol: null,
              //   };
              //   updateErc721Map(obj.contract_address.concat(obj.spender), obj);
              // }
            }
            // means approved for entire collection
            if (account_call.selector_name === 'setApprovalForAll') {
              const obj = {
                transaction_hash: account_call.transaction_hash,
                spender: account_call.calldata[0],
                tokenId: account_call.calldata[1],
                timestamp: account_call.timestamp,
                contract_address: account_call.contract_address,
                isSetApprovalForAll: true,
                name: null,
                symbol: null,
              };
              updateErc721Map(obj.contract_address.concat(obj.spender), obj);
            }
          }
        }
      }
    }
    const fetchDataAndFilterAddresses = async (
      address,
      isLoaded,
      setIsLoading
    ) => {
      if (address && !isLoaded) {
        setIsLoading(true);
        try {
          const data = await fetchData();
          if (data) filterAddresses(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
          setIsLoaded(true);
        }
      }
    };

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/transactions?id=${address}`);
        if (!response.ok) {
          throw new Error('Request failed');
        }
        const data = await response.json();
        // setTransactions(data);
        return data;
      } catch (error) {
        throw new Error('Error fetching data: ' + error.message);
      }
    };

    fetchDataAndFilterAddresses(address, isLoaded, setIsLoading);
  }, [address, isLoaded]); // Empty dependency array ensures this effect runs only once, when the component mounts
  return (
    <div className='min-w-full'>
      <div className="overflow-y-scroll" style={{maxHeight: "79vh"}}>
        <div
          className="relative overflow-x-auto shadow-md 
        sm:rounded-lg border mx-20 rounded-lg"
        >
          <table
            className="w-full text-sm text-left
           text-gray-500 dark:text-gray-400"
          >
            <thead
              className="font-bold text-white uppercase
             dark:bg-gray-700 dark:text-gray-400"
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
            <tbody className=''>
              {Object.entries(erc20Map).map(([key, value]) => (
                <ListItemERC20 key={key} transaction={value}></ListItemERC20>
              ))}
              {Object.entries(erc721Map).map(([key, value]) => (
                <ListItemERC721 key={key} transaction={value}></ListItemERC721>
              ))}
            </tbody>
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
          Made for &nbsp;
          <span className="text-rose-500 font-bold font-mono text-lg">
            <a href="https://alpha.starkguardians.com/">StarkGuardians</a>
          </span>
          &nbsp; by &nbsp;
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
