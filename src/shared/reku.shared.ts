import axios from 'axios';

const rekuBaseUrl = 'https://api.reku.id/';

const getMarketPrice = async (id_pair: number) => {
  const response = await axios.get(`${rekuBaseUrl}v2/price/${id_pair}`);
  const data = response?.data;
  return data;
};

export default { getMarketPrice };
