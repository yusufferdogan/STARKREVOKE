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
      <meta
        name="keywords"
        content="Starknet Revoke Allowance Approve Cairo Zk Rust"
      />
      <meta name="author" content="Yusuf Erdogan" />

      <meta property="og:title" content="StarkRevoke.com" />
      <meta
        property="og:description"
        content="StarkRevoke - Starknet Approve Revoker"
      />
      <meta
        property="og:image"
        content="https://images.emojiterra.com/twitter/512px/1f6e1.png"
      />
      <meta property="og:url" content="https://www.starkrevoke.com/" />
      <meta property="og:type" content="website" />
      <link rel="icon" href="favicon.ico" />
    </Head>
  );
}
