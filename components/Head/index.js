import React from 'react';
import Head from 'next/head';

export function CustomHead(params) {
  return (
    <Head>
      <title>Revoke.Starknet</title>
      <meta name="description" content="REVOKE.STARKNET" />
      <link rel="icon" href="favicon.ico" />
    </Head>
  );
}
