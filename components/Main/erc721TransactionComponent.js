import { BigNumber, ethers, constants } from 'ethers';
import {
  useContractRead,
  useAccount,
  useContractWrite,
} from '@starknet-react/core';
import React from 'react';
import { useMemo } from 'react';
import { uint256 } from 'starknet';
import nftAbi from '../../constants/simple-nft_abi.json';

function convertSecondsToDate(seconds) {
  const milliseconds = seconds * 1000;
  const date = new Date(milliseconds);

  return date;
}
function substr(str) {
  return (
    str.substring(0, 4) + '...' + str.substring(str.length - 4, str.length)
  );
}
export function TransactionComponentERC721({ transaction }) {
  const { address, status } = useAccount();
  // const { data, isLoading, error, refetch } = useContractRead({
  //   address: transaction.contract_address,
  //   abi: ERC20_ABI.abi,
  //   functionName: 'allowance',
  //   args: [address, transaction.spender],
  //   watch: false,
  // });
  const calls_approve = useMemo(() => {
    const tx = {
      contractAddress: transaction.contract_address,
      entrypoint: 'approve',
      calldata: [constants.AddressZero, transaction.tokenId, 0],
    };
    return Array(1).fill(tx);
  }, [transaction.contract_address, transaction.tokenId]);

  const { write: approveWrite } = useContractWrite({ calls: calls_approve });

  const calls_setApproveForAll = useMemo(() => {
    const tx = {
      contractAddress: transaction.contract_address,
      entrypoint: 'setApprovalForAll',
      calldata: [transaction.spender, false, 0],
    };
    return Array(1).fill(tx);
  }, [transaction.contract_address, transaction.spender]);

  const { write: setApproveForAllWrite } = useContractWrite({
    calls: calls_setApproveForAll,
  });
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
            {transaction.name === null
              ? substr(transaction.contract_address)
              : transaction.name}
          </a>
        </li>
        <li className="w-1/4">
          {transaction.isSetApprovalForAll
            ? 'Unlimited'
            : 'Token #' +
              BigNumber.from(transaction.tokenId).toNumber().toString()}
        </li>
        <li className="w-1/4">
          <a href={`https://starkscan.co/contract/${transaction.spender}`}>
            {substr(transaction.spender)}
          </a>
        </li>
        <li className="w-1/4">
          {convertSecondsToDate(transaction.timestamp).toDateString() + ' '}
          <p>
            {convertSecondsToDate(transaction.timestamp).toLocaleTimeString()}
          </p>
        </li>
        <li className="w-1/4">
          <button
            onClick={
              transaction.isSetApprovalForAll
                ? setApproveForAllWrite
                : approveWrite
            }
            className="border border-1 p-2"
          >
            revoke
          </button>
        </li>
      </ul>
    </div>
  );
}
