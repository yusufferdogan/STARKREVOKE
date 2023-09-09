import { ethers } from 'ethers';

export const UINT_256_MAX =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n;
export function convertSecondsToDate(seconds) {
  const milliseconds = seconds * 1000;
  const date = new Date(milliseconds);
  return date;
}
export function uint256ToBN(uint256 /*: Uint256*/) {
  return (BigInt(uint256.high) << 128n) + BigInt(uint256.low);
}
export function insertCharAt(str, char, index) {
  if (index > str.length) {
    // If the index is greater than the string length, simply append the character at the end
    return str + char;
  } else if (index < 0) {
    // If the index is negative, prepend the character at the beginning
    return char + str;
  } else {
    // Insert the character at the specified index
    return str.slice(0, index) + char + str.slice(index);
  }
}
export const currency = {
  '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7': 'ETH',
  '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8': 'USDC',
  '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8': 'USDT',
  '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3': 'DAI',
  '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac': 'WBTC',
  '0x042b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2':
    'wstETH',
};
export const icon = {
  '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7':
    'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
  '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8':
    'https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389',
  '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8':
    'https://assets.coingecko.com/coins/images/325/small/Tether.png?1668148663',
  '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3':
    'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png?1687143508',
  '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac':
    'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png?1548822744',
};
export const decimal = {
  '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7': 18,
  '0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8': 6,
  '0x068f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8': 6,
  '0x00da114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3': 18,
  '0x03fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac': 8,
};
export function unitValue(transaction, num) {
  if (decimal[transaction.contract_address]) {
    const formatted = ethers.utils.formatUnits(
      num,
      decimal[transaction.contract_address]
    );
    if (BigInt(num) >= UINT_256_MAX) return 'unlimited';
    else if (formatted > 1000) return '> 1000';
    else if (formatted > 1) return parseFloat(formatted).toFixed(2).toString();
    else if (formatted < 0.001) return '< 0.001';
    else return parseFloat(formatted).toFixed(4).toString();
  } else {
    const formatted = parseFloat(ethers.utils.formatEther(num));
    if (BigInt(num) >= UINT_256_MAX) return 'unlimited';
    else if (formatted > 1000) return '> 1000';
    else if (formatted < 0.001) return '< 0.001';
    else return parseFloat(formatted).toFixed(4).toString();
  }
}
export function substr(str) {
  return (
    str.substring(0, 4) + '...' + str.substring(str.length - 4, str.length)
  );
}

export function Loader() {
  return (
    <tr>
      <td className=""></td>
      <td className=""></td>
      <td className="">
        <div className="flex items-center justify-center py-5 min-w-screen">
          <div className="flex space-x-2 animate-pulse">
            <div className="w-3 h-3 bg-gray-500 rounded-full" />
            <div className="w-3 h-3 bg-gray-500 rounded-full" />
            <div className="w-3 h-3 bg-gray-500 rounded-full" />
          </div>
        </div>
      </td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  );
}
