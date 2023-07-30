import axios from 'axios';
import mockData from "../../constants/mockTx.json"
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export default async function handler(req, res) {
  const url = 'https://api.starkscan.co/api/v0/transactions/';
  const contract_address = req.query.id; // Use the 'id' from req.query as the contract_address
  const limit = 20;
  const headers = {
    accept: 'application/json',
    'x-api-key': 'docs-starkscan-co-api-123',
  };

  const data = [];
  let counter = 1;
  try {
    do {
      console.log('sending req:', counter);
      counter++;
      const startTime = new Date().getTime();

      const params = { contract_address, limit, cursor: null };

      const response = await axios.get(url, {
        headers,
        params: params,
        order_by: 'asc'
      });

      console.log("response.next_url:", response.data.next_url)
      // console.log("response:", response)

      if (response.data.next_url) {
        const searching_url = new URL(response.data.next_url);
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

      console.log('data.length: ', data.length);

      const endTime = new Date().getTime();

      // Calculate the time elapsed in milliseconds
      const timeElapsed = endTime - startTime;

      console.log('Time Elapsed (ms):', timeElapsed);

      console.log('response.data.data.length:', response.data.data.length);

      if (response.data.next_url) await sleep(1000);
      if (response.data.next_url) break;
    } while (1);

    console.log('Data.length:', data.length);

    // Set the Access-Control-Allow-Origin header to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Return the resource data as a JSON response
    console.log("REQUESTED");
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).send('Error fetching resource');
  }
}
