import axios from 'axios';

const indodaxBaseUrl = 'https://indodax.com/';

const getPairTicker = async (pair: string) => {
  const response = await axios.get(`${indodaxBaseUrl}api/ticker/${pair}`);
  const data = response?.data?.ticker;
  return data;
};

export default { getPairTicker };
