import axios from 'axios';
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
export default async function handler(req, res) {
  try {
    const url = 'https://api.starkscan.co/api/v0/transactions/';
    const contract_address = req.query.id; // Use the 'id' from req.query as the contract_address
    const limit = 20;
    const headers = {
      accept: 'application/json',
      'x-api-key': 'docs-starkscan-co-api-123',
    };

    const data = [];
    const params = { contract_address, limit };
    let next_url = null;
    let counter = 1;
    do {
      console.log("sending req:" , counter);
      counter++;
      const startTime = new Date().getTime();

      const response = await axios.get(url, {
        headers,
        params: params,
      });

      if (response.next_url) {
        const searching_url = new URL(response.next_url);
        const searchParams = searching_url.searchParams;
        const cursor = searchParams.get('cursor'); // 'value1'
        if (cursor) {
          params.cursor = cursor;
        }
        next_url = response.next_url;
      } else {
        next_url = null;
      }

      data.concat(response.data.data);
      console.log("data.length: ",data.length);

      const endTime = new Date().getTime();

      // Calculate the time elapsed in milliseconds
      const timeElapsed = endTime - startTime;

      console.log('Time Elapsed (ms):', timeElapsed);

      console.log('next_url:', next_url);
      console.log('response.data.data.length:', response.data.data.length);

      if (next_url != null) await sleep(1000);
    } while (next_url != null);

    console.log('Data:', data);

    // Set the Access-Control-Allow-Origin header to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Return the resource data as a JSON response
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).send('Error fetching resource');
  }
}
