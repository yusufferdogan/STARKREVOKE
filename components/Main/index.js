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
require('dotenv').config();
function Home() {
  const { account, address, status } = useAccount();
  const [transactions, setTransactions] = useState({});
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
  //only erc20 addresses
  const [addressSet, setAddressSet] = useState(new Set());

  const addToAddressSet = (value) => {
    setAddressSet((prevSet) => new Set([...prevSet, value]));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function filterAddresses() {
    console.log('filterAddresses:', transactions);
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
              addToAddressSet(obj.contract_address);
            } else {
              const obj = {
                transaction_hash: account_call.transaction_hash,
                spender: account_call.calldata[0],
                tokenId: account_call.calldata[1],
                timestamp: account_call.timestamp,
                contract_address: account_call.contract_address,
                isSetApprovalForAll: false,
                name: null,
                symbol: null,
              };
              updateErc721Map(obj.contract_address.concat(obj.spender), obj);
              addToAddressSet(obj.contract_address);
            }
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
            addToAddressSet(obj.contract_address);
          }
        }
      }
    }
  }
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  useEffect(() => {
    const fetchDataAndFilterAddresses = async (
      address,
      isLoaded,
      setIsLoading
    ) => {
      if (address && !isLoaded) {
        setIsLoading(true);
        // Call fetchData() and wait for it to complete before calling filterAddresses()
        await fetchData();
        await sleep(200); // Wait for 2 seconds
        filterAddresses();
        setIsLoading(false);
        setIsLoaded(true);
      }
    };
    // Function to fetch data
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/transactions?id=${address}`);
        if (!response.ok) {
          throw new Error('Request failed');
        }
        const data = await response.json();
        setTransactions(data.data);
        console.log('Transactions', data.data);
      } catch (error) {
        setIsLoading(false);
        setIsLoaded(true);
      }
    };

    // Call the fetchData function when the component mounts
    fetchDataAndFilterAddresses(address, isLoaded, setIsLoading);
  }, [address, filterAddresses, isLoaded]); // Empty dependency array ensures this effect runs only once, when the component mounts

  return (
    <div className="px-20">
      {console.log('erc20Map', erc20Map)}
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg border mx-20 rounded-lg  ">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="font-bold text-white uppercase dark:bg-gray-700 dark:text-gray-400">
            <tr>
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
          <tbody>
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
  );
}

export default Home;
