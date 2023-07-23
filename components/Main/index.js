import { React, useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import MyFooter from '../Footer';
import {
  useConnectors,
  useAccount,
  useContractRead,
  useBalance,
} from '@starknet-react/core';
import { BigNumber, ethers } from 'ethers';
import { useMemo } from 'react';
import { TransactionComponent } from './erc20TransactionComponent';
import { TransactionComponentERC721 } from './erc721TransactionComponent';
import axios from 'axios';

import { uint256 } from 'starknet';
import { ListItemERC20 } from './listItem';
import { ListItemERC721 } from './listItemErc721';
require('dotenv').config();
const Spinner = () => (
  <div role="status">
    <svg
      aria-hidden="true"
      className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
      viewBox="0 0 100 101"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
        fill="currentColor"
      />
      <path
        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
        fill="currentFill"
      />
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
);

function substr(str) {
  return (
    str.substring(0, 4) + '...' + str.substring(str.length - 4, str.length)
  );
}
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
    setIsLoading(false);
  }

  useEffect(() => {
    const fetcher = async (url) => {
      try {
        const response = await axios.get(url, {
          headers: {
            Accept: 'application/json',
            'x-api-key': process.env.API_KEY,
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching resource:', error);
        throw new Error('Error fetching resource');
      }
    };
    const fetchTransactions = async () => {
      setIsLoading(true);
      try {
        if (address !== undefined && !isLoaded) {
          const response = await fetcher(
            `https://api.starkscan.co/api/v0/transactions?contract_address=${address}&limit=100`
          );
          setTransactions(response.data);
          setIsLoaded(true);
          return response;
        }
      } catch (error) {
        console.error('Error fetching resource:', error);
        throw new Error('Error fetching resource');
      }
    };
    if (address !== undefined && !isLoaded) {
      fetchTransactions().then(() => filterAddresses());
    }
  }, [address, filterAddresses, isLoaded, transactions]);

  return (
    <div className="px-20">
      {loading ? (
        <div
          className="inline-block h-8 w-8 animate-[spinner-grow_0.75s_linear_infinite] rounded-full bg-current align-[-0.125em] text-primary opacity-0 motion-reduce:animate-[spinner-grow_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      ) : (
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
      )}

      <MyFooter></MyFooter>
    </div>
  );
}

export default Home;
