import axios from 'axios';
import { API_URL, RUTE_REQUEST_ENERGY } from './Rutes';

/**
 * Request energy from the mining API
 * @param stars - Number of stars/difficulty level
 * @param address - Bitcoin address
 * @param minNumber - Minimum number for random generation
 * @param maxNumber - Maximum number for random generation
 * @param gameId - Game identifier
 * @param socketId - Socket.io connection ID
 * @returns Promise with the API response
 */
export default async function RequestEnergy(
  stars: number,
  address: string,
  minNumber: number,
  maxNumber: number,
  gameId: string,
  socketId: string
): Promise<any> {
  const url = API_URL + RUTE_REQUEST_ENERGY;

  const response = await axios.post(
    url,
    {
      stars,
      address,
      minNumber,
      maxNumber,
      gameId,
      socketId,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
}

