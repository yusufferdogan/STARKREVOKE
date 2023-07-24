import React from 'react';
import { useMemo, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import { Spinner } from './spinner';
import {
  useContractRead,
  useAccount,
  useContractWrite,
} from '@starknet-react/core';
import { ERC20_ABI } from '../../constants/abi';
export const UINT_256_MAX =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n;
function convertSecondsToDate(seconds) {
  const milliseconds = seconds * 1000;
  const date = new Date(milliseconds);
  return date;
}
export function uint256ToBN(uint256 /*: Uint256*/) {
  return (BigInt(uint256.high) << 128n) + BigInt(uint256.low);
}
const currency = {
  '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7': 'ETH',
  '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8': 'USDC',
  '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8': 'USDT',
  '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3': 'DAI',
  '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac': 'WBTC',
};
const icon = {
  '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7':
    'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
  '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8':
    'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389',
  '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8':
    'https://assets.coingecko.com/coins/images/325/small/Tether.png?1668148663',
  '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3':
    'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png?1687143508',
  '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac':
    'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png?1548822744',
};
const decimal = {
  '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7': 18,
  '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8': 6,
  '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8': 6,
  '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3': 18,
  '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac': 8,
};
export function ListItemERC20({ transaction }) {
  const { address, status } = useAccount();
  const [amount, setAmount] = useState(0);
  const { data, isLoading, error, refetch } = useContractRead({
    address: transaction.contract_address,
    abi: ERC20_ABI.abi,
    functionName: 'allowance',
    args: [address, transaction.spender],
    watch: true,
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

  if (isLoading)
    return (
      <tr>
        <td></td> <td></td> <td>{/* <Spinner></Spinner> */}</td> <td></td>{' '}
        <td></td>
        <td></td>
      </tr>
    );
  if (error) return <span>Error: {JSON.stringify(error)}</span>;
  if (data === undefined) return <span>data is undefined...</span>;
  const num = BigInt(uint256ToBN(data?.remaining));
  if (num === 0n) return null;

  return (
    <tr
      className="border-b dark:bg-gray-800 dark:border-gray-700
     hover:bg-gray-700 dark:hover:bg-gray-600"
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
        {BigInt(num) >= UINT_256_MAX
          ? 'unlimited'
          : parseFloat(ethers.utils.formatEther(num)) > 100000
          ? '> 100000'
          : parseFloat(ethers.utils.formatEther(num)) < 0.0001
          ? '< 0.0001'
          : parseFloat(ethers.utils.formatEther(num)).toFixed(4).toString()}

        <span>
          &nbsp;&nbsp;
          {currency[transaction.contract_address] === undefined
            ? ''
            : currency[transaction.contract_address]}
        </span>
      </td>
      <td className="px-6 py-4 text-white">
        <a href={`https://starkscan.co/contract/${transaction.spender}`}>
          {transaction.spender.substring(0, 4) +
            '...' +
            transaction.spender.substring(
              transaction.spender.length - 4,
              transaction.spender.length
            )}
        </a>
      </td>{' '}
      <td className="px-6 py-4 text-white">
        {convertSecondsToDate(transaction.timestamp).toDateString() + ' '}
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
