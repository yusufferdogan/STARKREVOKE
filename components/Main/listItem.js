import React from 'react';
import { useMemo } from 'react';
import { SPENDERS } from '../../constants/spenders';
import {
  useContractRead,
  useAccount,
  useContractWrite,
} from '@starknet-react/core';
import { ERC20_ABI } from '../../constants/abi';
import {
  convertSecondsToDate,
  currency,
  icon,
  insertCharAt,
  uint256ToBN,
  unitValue,
} from './utils';
export function ListItemERC20({ transaction }) {
  const { address, status } = useAccount();
  const { data, isLoading, error, refetch } = useContractRead({
    address: transaction.contract_address,
    abi: ERC20_ABI.abi,
    functionName: 'allowance',
    args: [address, transaction.spender],
    watch: false,
  });
  const calls = useMemo(() => {
    const tx = {
      contractAddress: transaction.contract_address,
      entrypoint: 'approve',
      calldata: [transaction.spender, 0, 0],
    };
    return Array(1).fill(tx);
  }, [transaction.contract_address, transaction.spender]);

  const { write } = useContractWrite({ calls });

  if (isLoading) return null;
  if (error) return <span>Error: {JSON.stringify(error)}</span>;
  if (data === undefined) return <span>data is undefined...</span>;
  const num = BigInt(uint256ToBN(data?.remaining));
  if (num === 0n) return null;

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
        {unitValue(transaction, num)}
        <span>
          &nbsp;
          {currency[transaction.contract_address] === undefined
            ? ''
            : currency[transaction.contract_address]}
        </span>
      </td>
      <td className="px-6 py-4 text-white">
        <a href={`https://starkscan.co/contract/${transaction.spender}`}>
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
          onClick={write}
          type="button"
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Revoke
        </button>
      </td>
    </tr>
  );
}
