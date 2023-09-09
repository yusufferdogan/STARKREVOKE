export function filterAddresses(transactions) {
  const erc20 = {};
  const erc721 = {};

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
            if (obj.amount.low == '0x0' && obj.amount.high == '0x0') {
              // console.log('skipped:', obj.spender);
              delete erc20[obj.contract_address.concat(obj.spender)];
            } else {
              // Assuming updateErc20Map is a function to update properties on the obj
              erc20[obj.contract_address.concat(obj.spender)] = obj; // Replace 'newValue' with the actual value you want to add
            }
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
          // console.log("ERC721 OBJ: ", obj);
          if (obj.tokenId == '0x0') {
            // console.log('ERC721 deleted: ', obj.spender);
            delete erc721[obj.contract_address.concat(obj.spender)];
          } else erc721[obj.contract_address.concat(obj.spender)] = obj;
        }
      }
    }
  }

  return { erc20: erc20, erc721: erc721 };
}
