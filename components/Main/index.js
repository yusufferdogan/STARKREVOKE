import { React, useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import MyFooter from '../Footer';
import {
  useConnectors,
  useAccount,
  useContractRead,
} from '@starknet-react/core';
import { BigNumber, ethers } from 'ethers';
import { useMemo } from 'react';
import { TransactionComponent } from './erc20TransactionComponent';
import { TransactionComponentERC721 } from './erc721TransactionComponent';
import axios from 'axios';
import useSWR from 'swr';
import mockTx from './mockTx.json';
import { uint256 } from 'starknet';

// const fetchData2 = async (
//   url = 'https://api.starkscan.co/api/v0/nft-contract/'
// ) => {
//   try {
//     const response = await fetch(url, {
//       headers: {
//         accept: 'application/json',
//         'x-api-key': 'docs-starkscan-co-api-123',
//       },
//     });

//     if (response.ok) {
//       const data = await response.json();
//       return data;
//     } else {
//       throw new Error('Request failed');
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

function Home() {
  const { account, address, status } = useAccount();
  const [transactions, setTransactions] = useState(mockTx.data);
  const [isLoaded, setIsLoaded] = useState(false);
  //erc20 data
  const [erc20Map, setErc20Map] = useState({
    '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac0x41fd22b238fa21cfcf5dd45a8548974d8263b3a531a60388411c5e230f97023':
      {
        transaction_hash:
          '0x025a84a3c6898daf44d953e8ea48e7b3ae6cbd610caa87d6253de9d2416dfd1e',
        spender:
          '0x41fd22b238fa21cfcf5dd45a8548974d8263b3a531a60388411c5e230f97023',
        amount: {
          low: '0x1b380',
          high: '0x0',
        },
        timestamp: 1687684375,
        contract_address:
          '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac',
        blockNumber: 89956,
      },
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc70x7a6f98c03379b9513ca84cca1373ff452a7462a3b61598f0af5bb27ad7f76d1':
      {
        transaction_hash:
          '0x0721c4d308b46ae503e20c39cf728311c522cf3398425aba328879bb7b6ffd1a',
        spender:
          '0x7a6f98c03379b9513ca84cca1373ff452a7462a3b61598f0af5bb27ad7f76d1',
        amount: {
          low: '0x3ff2e795f50000',
          high: '0x0',
        },
        timestamp: 1687675634,
        contract_address:
          '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        blockNumber: 89863,
      },
    '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb30x1b23ed400b210766111ba5b1e63e33922c6ba0c45e6ad56ce112e5f4c578e62':
      {
        transaction_hash:
          '0x00ce37a9f639255c53ad62ef256abc24a83464bb51ea15165cddbe866c954be4',
        spender:
          '0x1b23ed400b210766111ba5b1e63e33922c6ba0c45e6ad56ce112e5f4c578e62',
        amount: {
          low: '0x16765a3bfd95b59ac',
          high: '0x0',
        },
        timestamp: 1685994375,
        contract_address:
          '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3',
        blockNumber: 73628,
      },
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc70x1b23ed400b210766111ba5b1e63e33922c6ba0c45e6ad56ce112e5f4c578e62':
      {
        transaction_hash:
          '0x01b0bf7a5039a881c64ac342c56bcba348450a7e12bc4ab67b397e63ce06832f',
        spender:
          '0x1b23ed400b210766111ba5b1e63e33922c6ba0c45e6ad56ce112e5f4c578e62',
        amount: {
          low: '0xffffffffffffffffffffffffffffffff',
          high: '0xffffffffffffffffffffffffffffffff',
        },
        timestamp: 1685914082,
        contract_address:
          '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        blockNumber: 72704,
      },
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc70x10884171baf1914edc28d7afb619b40a4051cfae78a094a55d230f19e944a28':
      {
        transaction_hash:
          '0x0519c16b09549a9917f33ea004dc87e6b5fce89bde37236ecc8fbde1d3e35791',
        spender:
          '0x10884171baf1914edc28d7afb619b40a4051cfae78a094a55d230f19e944a28',
        amount: {
          low: '0x1dfa2322e15a0',
          high: '0x0',
        },
        timestamp: 1685913957,
        contract_address:
          '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        blockNumber: 72703,
      },
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc70x6ac597f8116f886fa1c97a23fa4e08299975ecaf6b598873ca6792b9bbfb678':
      {
        transaction_hash:
          '0x05b348b2a50e73f8d2c77ed857383e892cebaf8496473bd105dacee827add8fd',
        spender:
          '0x6ac597f8116f886fa1c97a23fa4e08299975ecaf6b598873ca6792b9bbfb678',
        amount: {
          low: '0x2d79883d20000',
          high: '0x0',
        },
        timestamp: 1680960683,
        contract_address:
          '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        blockNumber: 33939,
      },
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc70x1bd387d18e52e0a04a87c5f9232e9b3cbd1d630837926e6fece2dea4a65bea9':
      {
        transaction_hash:
          '0x06472886ee006a5d099010b301059532fbc0c15fe08b5030b92bb321c417e33b',
        spender:
          '0x1bd387d18e52e0a04a87c5f9232e9b3cbd1d630837926e6fece2dea4a65bea9',
        amount: {
          low: '0x354a6ba7a18000',
          high: '0x0',
        },
        timestamp: 1683490713,
        contract_address:
          '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        blockNumber: 49525,
      },
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc70x88b0a6e4eaa5b05247d79c6a63b75d9829a28a4ff2f37a021c59cc241cd324':
      {
        transaction_hash:
          '0x04cef34b08a7c7738d9924a0d6480cadfa14294a2c22f34f047b3ad9ef1a929a',
        spender:
          '0x88b0a6e4eaa5b05247d79c6a63b75d9829a28a4ff2f37a021c59cc241cd324',
        amount: {
          low: '0x254db1c2244000',
          high: '0x0',
        },
        timestamp: 1683058460,
        contract_address:
          '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        blockNumber: 47958,
      },
    '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc70x79b882cb8200c1c1d20e849a2ef19124b0b8985358c1313ea6af588cfe4fec8':
      {
        transaction_hash:
          '0x00d16c9fb4bf606a7c737aea0594db71b415b2aa90c2399f01a43438729b5ca7',
        spender:
          '0x79b882cb8200c1c1d20e849a2ef19124b0b8985358c1313ea6af588cfe4fec8',
        amount: {
          low: '0x5d423c655aa0000',
          high: '0x0',
        },
        timestamp: 1680912616,
        contract_address:
          '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
        blockNumber: 33378,
      },
  });
  const updateErc20Map = (key, value) => {
    setErc20Map((prevMap) => ({
      ...prevMap,
      [key]: value,
    }));
  };
  //erc721 data
  const [erc721Map, setErc721Map] = useState({});
  const updateErc721Map = (key, value) => {
    setErc721Map((prevMap) => ({
      ...prevMap,
      [key]: value,
    }));
  };
  //only erc20 addresses
  const [addressSet, setAddressSet] = useState(new Set());

  const addToAddressSet = (value) => {
    setAddressSet((prevSet) => new Set([...prevSet, value]));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function filterAddresses() {
    console.log('filterAddresses', transactions);
    for (let i = 0; i < transactions.length; i++) {
      const element = transactions[i];
      if (element.account_calls.length > 0) {
        for (let j = 0; j < element.account_calls.length; j++) {
          const account_call = element.account_calls[j];
          if (account_call.selector_name === 'approve') {
            // if result is 0x1 it means true and it is erc20 approve
            if (
              account_call.result.length > 0 &&
              account_call.result[0] === '0x1'
            ) {
              const obj = {
                transaction_hash: account_call.transaction_hash,
                spender: account_call.calldata[0],
                amount: {
                  low: account_call.calldata[1],
                  high: account_call.calldata[2],
                },
                timestamp: account_call.timestamp,
                contract_address: account_call.contract_address,
                blockNumber: account_call.block_number,
              };
              updateErc20Map(obj.contract_address.concat(obj.spender), obj);
              addToAddressSet(obj.contract_address);
            } else {
              const obj = {
                transaction_hash: account_call.transaction_hash,
                spender: account_call.calldata[0],
                tokenId: account_call.calldata[1],
                timestamp: account_call.timestamp,
                contract_address: account_call.contract_address,
                isSetApprovalForAll: false,
                name: null,
                symbol: null,
              };
              updateErc721Map(obj.contract_address.concat(obj.spender), obj);
              addToAddressSet(obj.contract_address);
            }
          }
          // means approved for entire collection
          if (account_call.selector_name === 'setApprovalForAll') {
            const obj = {
              transaction_hash: account_call.transaction_hash,
              spender: account_call.calldata[0],
              tokenId: account_call.calldata[1],
              timestamp: account_call.timestamp,
              contract_address: account_call.contract_address,
              isSetApprovalForAll: true,
              name: null,
              symbol: null,
            };
            updateErc721Map(obj.contract_address.concat(obj.spender), obj);
            addToAddressSet(obj.contract_address);
          }
        }
      }
    }
  }

  // const API_KEY = 'docs-starkscan-co-api-123'; // Replace with your actual API key

  // const fetcher = async (url) => {
  //   try {
  //     const response = await axios.get(url, {
  //       headers: {
  //         Accept: 'application/json',
  //         'x-api-key': API_KEY,
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error fetching resource:', error);
  //     throw new Error('Error fetching resource');
  //   }
  // };

  // const fetchTransactions = async () => {
  //   try {
  //     if (address !== undefined && !isLoaded) {
  //       const response = await fetcher(
  //         `https://api.starkscan.co/api/v0/transactions?contract_address=${address}`
  //       );
  //       console.log('response:',response);
  //       setTransactions(response.data);
  //       return response;
  //     }
  //   } catch (error) {
  //     console.error('Error fetching resource:', error);
  //     throw new Error('Error fetching resource');
  //   }
  // };

  // const { data, error } = useSWR(address, fetchTransactions);
  function print() {
    // erc20Map.forEach((value, key) => {
    //   console.log(key, value);
    // });
    console.log(erc20Map);
    // console.log(transactions)
  }
  return (
    <div className="px-20">
      {/* <button className="pr-5" onClick={fetchTransactions}>
        FETCH
      </button> */}
      <button onClick={filterAddresses}>FILTER</button>
      <button className="pl-5" onClick={print}>
        PRINT
      </button>
      <div className="p-10 w-screen flex justify-center">
        <p className="w-1/4">Asset</p>
        <p className="w-1/4">Allowance</p>
        <p className="w-1/4">Spender</p>
        <p className="w-1/4">Last Updated</p>
        <p className="w-1/4">Actions</p>
      </div>
      <div className="p-10 w-screen ">
        <div>ERC20 APPROVES</div>

        {Object.entries(erc20Map).map(([key, value]) => (
          <TransactionComponent
            key={key}
            transaction={value}
            // nameTag={nameTag[value.contract_address]}
          ></TransactionComponent>
        ))}
      </div>
      <div className="p-10 w-screen ">
        <div>ERC721 APPROVES</div>
        {Object.entries(erc721Map).map(([key, value]) => (
          <TransactionComponentERC721
            key={key}
            transaction={value}
          ></TransactionComponentERC721>
        ))}
      </div>

      <div className="h-screen justify-center flex">
        Made by
        <span>
          <a
            href="https://github.com/yusufferdogan"
            className="text-sky-400 font-extrabold"
          >
            &nbsp;@yusufferdogan
          </a>
        </span>
      </div>
      <MyFooter></MyFooter>
    </div>
  );
}

export default Home;
