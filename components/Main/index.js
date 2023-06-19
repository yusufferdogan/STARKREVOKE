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
import { ERC20_ABI } from '../../constants/abi';
const fetchData2 = async (
  url = 'https://api.starkscan.co/api/v0/nft-contract/'
) => {
  try {
    const response = await fetch(url, {
      headers: {
        accept: 'application/json',
        'x-api-key': 'docs-starkscan-co-api-123',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('Request failed');
    }
  } catch (error) {
    console.error(error);
  }
};

function Home() {
  const { account, address, status } = useAccount();
  const [isFetched, setIsFetched] = useState(false);
  const [transactions, setTransactions] = useState([]);

  //erc20 data
  const [erc20Map, setErc20Map] = useState({});
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
  // address => name_tag
  const [nameTag, setNameTag] = useState({});
  const updateNameTag = (key, value) => {
    setNameTag((prevMap) => ({
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
    console.log('filterAddresses');
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
                amount: account_call.calldata[1],
                timestamp: account_call.timestamp,
                contract_address: account_call.contract_address,
              };
              console.log('obj added', obj);
              updateErc20Map(obj.contract_address.concat(obj.spender), obj);
              addToAddressSet(obj.contract_address);
            } else {
              //means erc721 single approve
              let name = null;
              let symbol = null;
              try {
                const nftData = await fetchData2(
                  `https://api.starkscan.co/api/v0/nft-contract/${account_call.contract_address}`
                );
                name = nftData.name;
                symbol = nftData.symbol;
              } catch (e) {
                console.error(e);
              }

              const obj = {
                transaction_hash: account_call.transaction_hash,
                spender: account_call.calldata[0],
                tokenId: account_call.calldata[1],
                timestamp: account_call.timestamp,
                contract_address: account_call.contract_address,
                isSetApprovalForAll: false,
                name: name,
                symbol: symbol,
              };
              updateErc721Map(obj.contract_address.concat(obj.spender), obj);
              addToAddressSet(obj.contract_address);
            }
          }
          // means approved for entire collection
          if (account_call.selector_name === 'setApprovalForAll') {
            let name = null;
            let symbol = null;
            try {
              const nftData = await fetchData2(
                `https://api.starkscan.co/api/v0/nft-contract/${account_call.contract_address}`
              );
              name = nftData.name;
              symbol = nftData.symbol;
            } catch (e) {
              console.error(e);
            }

            const obj = {
              transaction_hash: account_call.transaction_hash,
              spender: account_call.calldata[0],
              tokenId: account_call.calldata[1],
              timestamp: account_call.timestamp,
              contract_address: account_call.contract_address,
              isSetApprovalForAll: true,
              name: name,
              symbol: symbol,
            };
            updateErc721Map(obj.contract_address.concat(obj.spender), obj);
            addToAddressSet(obj.contract_address);
          }
        }
      }
    }
    Array.from(addressSet).forEach((value) => {
      console.log(value);
    });
    Object.entries(erc20Map).map(([key, value]) => {
      console.log(key, value);
    });
    // console.log(addressSet)
    // console.log(addressSet.size)
    // for (const item in addressSet) {
    //   console.log(item);
    //   try {
    //     const contractData = await fetchData2(
    //       `https://api.starkscan.co/api/v0/contract/${item}`
    //     );
    //     console.log(contractData)

    //     updateNameTag(item, {
    //       isContractNameVerified: contractData.is_verified,
    //       name: contractData.name_tag,
    //     });
    //   } catch (e) {
    //     console.log(e);
    //   }
    // }
    // console.log("nametag: ",nameTag)
    // Object.entries(nameTag).forEach(([key, value]) => {
    //   console.log(key, value);
    // });
  }
  useEffect(() => {
    async function fetchData() {
      const url = `https://api.starkscan.co/api/v0/transactions?contract_address=${address}`;
      // const url = `https://api-testnet.starkscan.co/api/v0/transactions?contract_address=${address}`;
      const apiKey = 'docs-starkscan-co-api-123';

      try {
        const response = await fetch(url, {
          headers: {
            accept: 'application/json',
            'x-api-key': apiKey,
          },
        });

        if (!response.ok) {
          throw new Error('Request failed');
        }

        const data = await response.json();

        setTransactions(data.data);
        console.log('Transactions:', data.data);
        setIsFetched(true);
      } catch (error) {
        console.error(error);
      }
    }
    if (address != undefined && !isFetched) {
      fetchData(), filterAddresses();
    }
  }, [address, filterAddresses, isFetched, transactions]);

  return (
    <div className="px-20">
      <button onClick={filterAddresses}>FILTER</button>
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
