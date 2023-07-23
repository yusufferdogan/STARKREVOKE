import React from 'react';
import { BigNumber, ethers, constants } from 'ethers';

function convertSecondsToDate(seconds) {
  const milliseconds = seconds * 1000;
  const date = new Date(milliseconds);
  return date;
}
export function uint256ToBN(uint256) {
  return (BigInt(uint256.high) << 128n) + BigInt(uint256.low);
}
function substr(str) {
  return (
    str.substring(0, 4) + '...' + str.substring(str.length - 4, str.length)
  );
}
export function ListItemERC721({ transaction }) {
  return (
    <tr
      key={transaction.transaction_hash
        .concat(transaction.spender)
        .concat(transaction.amount)}
      className="border-b dark:bg-gray-800 dark:border-gray-700
     hover:bg-gray-700 dark:hover:bg-gray-600"
    >
      <th
        scope="row"
        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
      >
        <img
          className="w-10 h-10 rounded-full"
          src="https://img.freepik.com/free-vector/nft-non-fungible-token-concept-with-neon-light-effect_1017-41102.jpg?w=826&t=st=1688758281~exp=1688758881~hmac=5c3f52f5944d46cd5b23b5bb89ac3524dfaec2fe4f05f953f81075cefce20863"
          alt="nft logo"
        />
        <a
          className="text-white pl-3"
          href={`https://starkscan.co/contract/${transaction.contract_address}`}
        >
          {transaction.name === null
            ? substr(transaction.contract_address)
            : transaction.name}
        </a>
      </th>
      <td className="px-6 py-4 text-white">
        {transaction.isSetApprovalForAll
          ? 'Unlimited'
          : 'Token #' +
            BigNumber.from(transaction.tokenId).toNumber().toString()}
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
          <div className="h-2.5 w-2.5 rounded-full bg-purple-500 mr-2" /> Nft
        </div>
      </td>
      <td className="px-6 py-4">
        <button
          type="button"
          className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Revoke
        </button>
      </td>
    </tr>
  );
}
