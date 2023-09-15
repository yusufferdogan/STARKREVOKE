import { BigNumber } from 'ethers';
import React, { useState } from 'react';
import { nftData } from '../../constants/nftData';
import { SPENDERS } from '../../constants/spenders';
import { convertSecondsToDate, insertCharAt, substr } from './utils';
require('dotenv').config();
import { AiFillCheckCircle } from 'react-icons/ai';

export function ListItemERC721({ transaction, id, toggle, selected }) {
  const targetNft = nftData.find(
    (nft) => nft.contract_address === transaction.contract_address
  );
  const spender = SPENDERS.find(
    (sp) => sp.contract_address === insertCharAt(transaction.spender, '0', 2)
  );

  return (
    <tr
      key={transaction.transaction_hash
        .concat(transaction.spender)
        .concat(transaction.amount)}
      className={`border-b rounded-lg ${selected ? 'bg-slate-700' : ''}`}
    >
      <th
        scope="row"
        className="flex items-center px-6 py-4
         text-gray-900 whitespace-nowrap dark:text-white"
      >
        {transaction.hasOwnProperty('image_url') && targetNft.image_url ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            className="w-10 h-10 rounded-full"
            src={targetNft.image_url}
            alt="nft logo"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            className="w-10 h-10 rounded-full"
            src="https://img.freepik.com/free-vector/nft-non-fungible-token-concept-with-neon-light-effect_1017-41102.jpg?w=826&t=st=1688758281~exp=1688758881~hmac=5c3f52f5944d46cd5b23b5bb89ac3524dfaec2fe4f05f953f81075cefce20863"
            alt="nft logo"
          />
        )}

        <a
          className="text-white pl-3"
          href={`https://starkscan.co/contract/${transaction.contract_address}`}
        >
          {targetNft ? targetNft.name : substr(transaction.contract_address)}
        </a>
      </th>
      <td className="px-6 py-4 text-white">
        {transaction.isSetApprovalForAll
          ? 'Unlimited'
          : 'Token #' +
            BigNumber.from(transaction.tokenId).toNumber().toString()}
      </td>
      <td className="px-6 py-4 text-white">
        <a
          className="text-ellipsis"
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
      <td className="px-6 py-4 ">
        <button onClick={() => toggle(id)} className="flex align-bottom">
          <AiFillCheckCircle
            className={`text-4xl ${selected ? 'text-green-700' : ' '}`}
          />
        </button>
      </td>
    </tr>
  );
}
