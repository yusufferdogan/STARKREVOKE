import React from 'react';
import Head from 'next/head';
// import { useAccount } from '@starknet-react/core';

// function substr(str) {
//   return (
//     str.substring(0, 6) + '...' + str.substring(str.length - 4, str.length)
//   );
// }
export function CustomHead(params) {
  // const { account, address, status } = useAccount();
  //{address ? ' | ' + substr(address) : ''}
  return (
    <Head>
      <title>StarkRevoke - Starknet Approve Revoker </title>
      <meta name="description" content="starkrevoke.com" />
      <link rel="icon" href="favicon.ico" />
    </Head>
  );
}
