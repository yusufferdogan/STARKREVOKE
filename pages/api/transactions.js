import axios from 'axios';
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
require('dotenv').config();
export default async function handler(req, res) {
  const url = 'https://api.starkscan.co/api/v0/transactions/';
  const contract_address = req.query.id; // Use the 'id' from req.query as the contract_address
  const limit = 100;
  const headers = {
    accept: 'application/json',
    'x-api-key': process.env.API_KEY,
  };

  const data = [];
  const params = { contract_address, limit, cursor: null };

  try {
    let next_url = null;
    do {
      const response = await axios.get(url, {
        headers,
        params: params,
        order_by: 'asc',
      });

      next_url = response.data.next_url;

      if (next_url) {
        const searching_url = new URL(next_url);
        const searchParams = searching_url.searchParams;
        const cursor = searchParams.get('cursor'); // 'value1'
        if (cursor) {
          params.cursor = cursor;
        }
      }

      for (let index = 0; index < response.data.data.length; index++) {
        const element = response.data.data[index];
        console.log(element.nonce);
        data.push(element);
      }

      if (next_url) await sleep(1000);
      if (next_url === undefined || next_url === null) break;
    } while (1);

    // Set the Access-Control-Allow-Origin header to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', 'https://www.starkrevoke.com/');

    // Return the resource data as a JSON response
    res.status(200).json(data.reverse());
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).send('Error fetching resource');
  }
}
