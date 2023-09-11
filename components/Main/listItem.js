import { React, useEffect, useState } from 'react';
import { SPENDERS } from '../../constants/spenders';
import { connect } from '@argent/get-starknet';
import { RpcProvider, CallData, cairo } from 'starknet';
require('dotenv').config();

import {
  convertSecondsToDate,
  currency,
  icon,
  insertCharAt,
  unitValue,
} from './utils';
export function ListItemERC20({ transaction, allowance }) {
  const [address, setAddress] = useState('');

  useEffect(() => {
    // or try to connect to an approved wallet silently (on mount probably)
    const savedAddress = sessionStorage.getItem('address');
    if (savedAddress) {
      setAddress(savedAddress);
    }
  }, []);

  async function sendTx() {
    try {
      const starknet = await connect({ showList: false });

      await starknet.enable();

      const provider = new RpcProvider({
        nodeUrl: process.env.ALCHEMY_URL,
      });

      const result = await starknet.account.execute({
        contractAddress: transaction.contract_address,
        entrypoint: 'approve',
        calldata: CallData.compile({
          spender: transaction.spender,
          amount: cairo.uint256(0n),
        }),
      });
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

  const date = convertSecondsToDate(transaction.timestamp);
  const spender = SPENDERS.find(
    (sp) => sp.contract_address === insertCharAt(transaction.spender, '0', 2)
  );

  return (
    <tr
      className="border-b rounded-lg 
     hover:bg-gray-700"
    >
      <th
        scope="row"
        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="w-10 h-10 rounded-full"
          src={icon[transaction?.contract_address]}
          alt="coin logo"
        />
        <a
          className="text-white pl-3"
          target="_blank"
          rel="noopener noreferrer"
          href={`https://starkscan.co/contract/${transaction.contract_address}`}
        >
          {transaction.contract_address.substring(0, 4) +
            '...' +
            transaction.contract_address.substring(
              transaction.contract_address.length - 4,
              transaction.contract_address.length
            )}
        </a>
      </th>
      <td className="px-6 py-4 text-white">
        {unitValue(transaction, allowance)}
        <span>
          &nbsp;
          {currency[transaction.contract_address] === undefined
            ? ''
            : currency[transaction.contract_address]}
        </span>
      </td>
      <td className="px-6 py-4 text-white">
        <a
          target="_blank"
          rel="noopener noreferrer 2"
          href={`https://starkscan.co/contract/${transaction.spender}`}
        >
          {spender
            ? spender.name_tag
            : transaction.spender.substring(0, 4) +
              '...' +
              transaction.spender.substring(
                transaction.spender.length - 4,
                transaction.spender.length
              )}
        </a>
      </td>{' '}
      <td className="px-6 py-4 text-white">
        {date.toDateString()}
        <p>
          {convertSecondsToDate(transaction.timestamp).toLocaleTimeString()}
        </p>
      </td>
      <td className="px-6 py-4 text-white">
        <div className="flex items-center">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2" /> Token
        </div>
      </td>
      <td className="px-6 py-4">
        <button
          onClick={sendTx}
          type="button"
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Revoke
        </button>
      </td>
    </tr>
  );
}
