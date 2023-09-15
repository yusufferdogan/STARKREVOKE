import { React, useEffect, useState } from 'react';
import { SPENDERS } from '../../constants/spenders';
import { AiFillCheckCircle } from 'react-icons/ai';
import {
  convertSecondsToDate,
  currency,
  icon,
  insertCharAt,
  unitValue,
} from './utils';
export function ListItemERC20({
  id,
  transaction,
  allowance,
  toggle,
  selected,
}) {
  const [address, setAddress] = useState('');

  useEffect(() => {
    // or try to connect to an approved wallet silently (on mount probably)
    const savedAddress = sessionStorage.getItem('address');
    if (savedAddress) {
      setAddress(savedAddress);
    }
  }, []);

  console.log(id);

  const date = convertSecondsToDate(transaction.timestamp);
  const spender = SPENDERS.find(
    (sp) => sp.contract_address === insertCharAt(transaction.spender, '0', 2)
  );

  return (
    <tr
      className={`border-b rounded-lg ${
        selected ? 'bg-slate-700' : ''
      }`}
    >
      <th
        scope="row"
        className="flex items-center px-6 py-4
         text-gray-900 whitespace-nowrap dark:text-white"
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
      </td>
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
      <td className="px-6 py-4 text-4xl">
        <button onClick={() => toggle(id)} className="flex align-bottom">
          <AiFillCheckCircle
            className={selected ? 'text-green-700 ' : 'text-4xl'}
          />
        </button>
      </td>
    </tr>
  );
}
