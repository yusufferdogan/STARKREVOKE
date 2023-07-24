import axios from 'axios';

export default async function handler(req, res) {
  try {
    const url = "https://api.starkscan.co/api/v0/transactions/";
    const contract_address = req.query.id; // Use the 'id' from req.query as the contract_address

    const headers = {
      "accept": "application/json",
      "x-api-key": "docs-starkscan-co-api-123"
    };

    const response = await axios.get(url, {
      headers,
      params: { contract_address }
    });

    const data = response.data;

    // Set the Access-Control-Allow-Origin header to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Return the resource data as a JSON response
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).send('Error fetching resource');
  }
}
