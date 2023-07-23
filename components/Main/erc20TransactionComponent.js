import { useMemo, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import {
  useContractRead,
  useAccount,
  useContractWrite,
} from '@starknet-react/core';
import { ERC20_ABI } from '../../constants/abi';
import React from 'react';
export const UINT_256_MAX =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n;
const currency = {
  '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7': 'ETH',
  '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8': 'USDC',
  '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8': 'USDT',
  '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3': 'DAI',
  '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac': 'WBTC',
};
function convertSecondsToDate(seconds) {
  const milliseconds = seconds * 1000;
  const date = new Date(milliseconds);
  return date;
}
export function uint256ToBN(uint256 /*: Uint256*/) {
  return (BigInt(uint256.high) << 128n) + BigInt(uint256.low);
}
export function TransactionComponent({ transaction }) {
  const { address, status } = useAccount();
  //TODO: AMOUNT EDITER
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
      calldata: [transaction.spender, amount, 0],
    };
    return Array(1).fill(tx);
  }, [amount, transaction.contract_address, transaction.spender]);

  const { write } = useContractWrite({ calls });

  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>Error: {JSON.stringify(error)}</span>;
  if (data === undefined) return <span>data is undefined...</span>;
  const num = BigInt(uint256ToBN(data?.remaining));
  if (num > 0n) console.log(num - UINT_256_MAX);
  if (num === 0n) return null;

  return (
    <div
      key={transaction.transaction_hash.concat(transaction.spender)}
      className=""
    >
      <ul className="py-10 flex gap-2">
        <li className="w-1/4">
          <a
            href={`https://starkscan.co/contract/${transaction.contract_address}`}
          >
            {transaction.contract_address.substring(0, 4) +
              '...' +
              transaction.contract_address.substring(
                transaction.contract_address.length - 4,
                transaction.contract_address.length
              )}
          </a>
        </li>
        <li className="w-1/4">
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
        </li>
        <li className="w-1/4">
          <a href={`https://starkscan.co/contract/${transaction.spender}`}>
            {transaction.spender.substring(0, 4) +
              '...' +
              transaction.spender.substring(
                transaction.spender.length - 4,
                transaction.spender.length
              )}
          </a>
        </li>
        <li className="w-1/4">
          {convertSecondsToDate(transaction.timestamp).toDateString() + ' '}
          <p>
            {convertSecondsToDate(transaction.timestamp).toLocaleTimeString()}
          </p>
        </li>
        <li className="w-1/4">
          <button onClick={write} className="border border-1 p-2">
            revoke
          </button>
        </li>
      </ul>
    </div>
  );
}
