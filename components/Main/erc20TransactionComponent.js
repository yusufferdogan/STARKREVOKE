import { useMemo } from 'react';
import { BigNumber, ethers } from 'ethers';
import {
  useContractRead,
  useAccount,
  useContractWrite,
} from '@starknet-react/core';
import { ERC20_ABI } from '../../constants/abi';
import { uint256, BN } from 'starknet';
import React from 'react';
export const UINT_256_MAX = (1n << 256n) - 1n;

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

  if (isLoading) return <span>Loading...</span>;
  if (error) return <span>Error: {JSON.stringify(error)}</span>;
  if (data === undefined) return <span>data is undefined...</span>;
  const num = uint256ToBN(transaction.amount);
  console.log(UINT_256_MAX == num);

  // let unlimited = amount.gte(ethers.utils.parseEther('100000000000000000000'));
  // let amount;
  // if(!unlimited){
  //   amount = uint256.uint256ToBN(data?.remaining).div(BigNumber.from(ethers.utils.parseEther('1'))).toNumber();
  // } else {
  //   amount = ' > 1000';
  // }
  // const amount = uint256
  //   .uint256ToBN(data?.remaining)
  //   .div(BigNumber.from(ethers.utils.parseEther('1')))
  //   .toNumber();

  // if(amount === 0) return null;
  return (
    <div
      key={transaction.transaction_hash
        .concat(transaction.spender)
        .concat(transaction.amount)}
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
          {num == UINT_256_MAX
            ? 'unlimited'
            : parseFloat(ethers.utils.formatEther(num)) < 0.0001
            ? '< 0.0001'
            : parseFloat(ethers.utils.formatEther(num)).toFixed(4).toString()}
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
        </li>{' '}
        <li className="w-1/4">
          <button onClick={write} className="border border-1 p-2">
            {' '}
            revoke{' '}
          </button>
        </li>
      </ul>
    </div>
  );
}
