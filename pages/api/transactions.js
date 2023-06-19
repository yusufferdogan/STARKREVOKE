import axios from 'axios';

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
  const { id } = req.query;

  try {
    const response = await axios.get(
      `https://api-testnet.starkscan.co/collection/1/${id}.json`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    const data = response.data;

    // Set the Access-Control-Allow-Origin header to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Return the resource data as a JSON response
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).send('Error fetching resource');
  }
};
