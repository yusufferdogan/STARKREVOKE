import { useMemo } from 'react';
import { BigNumber, ethers } from 'ethers';
import {
  useContractRead,
  useAccount,
  useContractWrite,
} from '@starknet-react/core';
import { ERC20_ABI } from '../../constants/abi';
import { uint256 } from 'starknet';
import React from 'react';
function convertSecondsToDate(seconds) {
  const milliseconds = seconds * 1000;
  const date = new Date(milliseconds);

  return date;
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

  let amount = uint256.uint256ToBN(data?.remaining).toNumber() / 10 ** 18;
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
          {amount < 0.0001 ? '< 0.0001' : amount.toFixed(4)}
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
