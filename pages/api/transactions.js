import axios from 'axios';

export const fetchTransactions = async (req, res) => {
  const { id } = req.query;
  console.log('Fetching transaction:', id);

  try {
    const response = await axios.get(
      `https://api.starkscan.co/api/v0/transactions/${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    const data = response.data;
    console.log('TRANSACTIONS.JS:', data);

    // Set the Access-Control-Allow-Origin header to allow requests from any origin
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Return the resource data as a JSON response
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).send('Error fetching resource');
  }
};
