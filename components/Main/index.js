import { React, useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import MyFooter from '../Footer';
import { TodoPage } from '../../pages/features/todos/todoPage';
import { addTodo } from '../../pages/features/todos/todoSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useConnectors, useAccount } from '@starknet-react/core';
import { BigNumber, ethers } from 'ethers';
import { useMemo } from 'react';

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
function convertSecondsToDate(seconds) {
  const milliseconds = seconds * 1000;
  const date = new Date(milliseconds);

  return date;
}
function Home() {
  const dispatch = useDispatch();
  const { account, address, status } = useAccount();
  const [isFetched, setIsFetched] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [erc20Addresses, setErc20Addresses] = useState([]);
  const [erc721Addresses, setErc721Addresses] = useState([]);

  const addItemToErc20 = (item) => {
    setErc20Addresses((prevList) => [...prevList, item]);
  };
  const addItemToErc721 = (item) => {
    setErc721Addresses((prevList) => [...prevList, item]);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function filterAddresses() {
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
              let spenderName;
              let isContractNameVerified = false;
              try {
                const contractData = await fetchData2(
                  `https://api.starkscan.co/api/v0/contract/${account_call.calldata[0]}`
                );
                spenderName = contractData.name_tag;
                isContractNameVerified = contractData.is_verified;
              } catch (e) {
                console.log(e);
              }

              const obj = {
                transaction_hash: account_call.transaction_hash,
                spender: account_call.calldata[0],
                amount: account_call.calldata[1],
                timestamp: account_call.timestamp,
                contract_address: account_call.contract_address,
                spenderName: spenderName,
                isContractNameVerified: isContractNameVerified,
              };
              addItemToErc20(obj);
            } else {
              //means erc721 single approve
              const nftData = await fetchData2(
                `https://api.starkscan.co/api/v0/nft-contract/${account_call.contract_address}`
              );
              let spenderName;
              let isContractNameVerified = false;

              try {
                const contractData = await fetchData2(
                  `https://api.starkscan.co/api/v0/contract/${account_call.calldata[0]}`
                );
                spenderName = contractData.name_tag;
                isContractNameVerified = contractData.is_verified;
              } catch (e) {
                console.log(e);
              }
              const obj = {
                transaction_hash: account_call.transaction_hash,
                spender: account_call.calldata[0],
                tokenId: account_call.calldata[1],
                timestamp: account_call.timestamp,
                contract_address: account_call.contract_address,
                isSetApprovalForAll: false,
                name: nftData.name,
                symbol: nftData.symbol,
                spenderName: spenderName,
                isContractNameVerified: isContractNameVerified,
              };
              addItemToErc721(obj);
            }
          }
          // means approved for entire collection
          if (account_call.selector_name === 'setApprovalForAll') {
            const nftData = await fetchData2(
              `https://api.starkscan.co/api/v0/nft-contract/${account_call.contract_address}`
            );
            let spenderName;
            let isContractNameVerified = false;
            try {
              const contractData = await fetchData2(
                `https://api.starkscan.co/api/v0/contract/${account_call.calldata[0]}`
              );
              spenderName = contractData.name_tag;
              isContractNameVerified = contractData.is_verified;
            } catch (e) {
              console.log(e);
            }

            const obj = {
              transaction_hash: account_call.transaction_hash,
              spender: account_call.calldata[0],
              tokenId: account_call.calldata[1],
              timestamp: account_call.timestamp,
              contract_address: account_call.contract_address,
              isSetApprovalForAll: true,
              name: nftData.name,
              symbol: nftData.symbol,
              spenderName: spenderName,
              isContractNameVerified: isContractNameVerified,
            };
            addItemToErc721(obj);
          }
        }
      }
    }
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
  }, [address, dispatch, filterAddresses, isFetched, transactions]);

  return (
    <div className="px-20">
      <button onClick={filterAddresses}>FILTER</button>
      {console.log(erc20Addresses)}
      {console.log(erc721Addresses)}
      <div className="p-10 w-screen flex justify-center">
        <p className="w-1/4">Asset</p>
        <p className="w-1/4">Allowance</p>
        <p className="w-1/4">Spender</p>
        <p className="w-1/4">Last Updated</p>
        <p className="w-1/4">Actions</p>
      </div>
      <div className="p-10 w-screen ">
        <div>ERC20 APPROVES</div>

        {erc20Addresses.map((transaction) => (
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
                {ethers.utils.formatEther(BigNumber.from(transaction.amount))}
              </li>
              <li className="w-1/4">
                <a
                  href={`https://starkscan.co/contract/${transaction.spender}`}
                >
                  {transaction.spenderName !== undefined &&
                  transaction.isContractNameVerified
                    ? transaction.spenderName
                    : transaction.spender.substring(0, 4) +
                      '...' +
                      transaction.spender.substring(
                        transaction.spender.length - 4,
                        transaction.spender.length
                      )}
                </a>
              </li>
              <li className="w-1/4">
                {convertSecondsToDate(transaction.timestamp).toDateString() +
                  ' '}
                <p>
                  {convertSecondsToDate(
                    transaction.timestamp
                  ).toLocaleTimeString()}
                </p>
              </li>{' '}
              <li className="w-1/4">
                <button className="border border-1"> revoke </button>
                {/* {transaction.contract_address} */}
              </li>
            </ul>
          </div>
        ))}
      </div>
      <div className="p-10 w-screen ">
        <div>ERC721 APPROVES</div>
        {erc721Addresses.map((transaction) => (
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
                  {transaction.name}
                </a>
              </li>
              <li className="w-1/4">
                {transaction.isSetApprovalForAll
                  ? 'Unlimited'
                  : 'Token #' +
                    BigNumber.from(transaction.tokenId).toNumber().toString()}
              </li>
              <li className="w-1/4">
                <a
                  href={`https://starkscan.co/contract/${transaction.spender}`}
                >
                  {transaction.spenderName !== undefined &&
                  transaction.isContractNameVerified
                    ? transaction.spenderName
                    : transaction.spender.substring(0, 4) +
                      '...' +
                      transaction.spender.substring(
                        transaction.spender.length - 4,
                        transaction.spender.length
                      )}
                </a>
              </li>
              <li className="w-1/4">
                {convertSecondsToDate(transaction.timestamp).toDateString() +
                  ' '}
                <p>
                  {convertSecondsToDate(
                    transaction.timestamp
                  ).toLocaleTimeString()}
                </p>
              </li>
              <li className="w-1/4">
                <button className="border border-1"> revoke </button>
                {/* {transaction.contract_address} */}
              </li>
            </ul>
          </div>
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
