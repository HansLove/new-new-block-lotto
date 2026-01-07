import axios from 'axios';
import io, { Socket } from 'socket.io-client';

import { API_URL, RUTE_ENTROPY_HIGH, RUTE_ENTROPY_LOW } from '@/utils/Rutes';

export interface LowEntropyResponse {
  requestId: string;
  energy: {
    nonce: number;
    hash: string;
    merkleRoot: string;
    blockHeight: number;
    prevHash: string;
    bits: string;
    timestamp: number;
    isBlock: boolean;
    blockHash: string | null;
  };
}

interface HighEntropyResponse {
  message: string;
  requestId: string;
}

export interface EntropyCompleted {
  requestId: string;
  nonce: number;
  hash: string;
  merkleRoot: string;
  blockHeight: number;
  prevHash: string;
  bits: string;
  timestamp: number;
  stars: number;
  leadingZeros: number;
  address: string;
  seed: string;
}

let socket: Socket | null = null;

const getSocket = (): Socket => {
  if (!socket) {
    socket = io(API_URL, {
      transports: ['polling', 'websocket'],
      closeOnBeforeunload: true,
    });
  }
  return socket;
};

export const generateHexSeed = (): string => {
  const hexChars = '0123456789abcdef';
  let seed = '';
  for (let i = 0; i < 8; i++) {
    seed += hexChars[Math.floor(Math.random() * 16)];
  }
  return seed;
};

export const isValidHexSeed = (seed: string): boolean => {
  // Must be exactly 8 hex characters (Go's hex.DecodeString requires even length)
  return /^[0-9a-fA-F]{8}$/.test(seed);
};

export const requestLowEntropy = async (address: string, stars: number): Promise<LowEntropyResponse> => {
  const url = API_URL + RUTE_ENTROPY_LOW;

  const response = await axios.post<LowEntropyResponse>(
    url,
    { address, stars },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};

export const requestHighEntropy = async (address: string, stars: number, seed: string): Promise<EntropyCompleted> => {
  const url = API_URL + RUTE_ENTROPY_HIGH;

  // Ensure seed is clean: trimmed, lowercase, and only hex chars
  const cleanSeed = seed
    .trim()
    .toLowerCase()
    .replace(/[^0-9a-f]/g, '');

  console.log('Sending high entropy request:', { address, stars, seed: cleanSeed, originalSeed: seed });

  const response = await axios.post<HighEntropyResponse>(
    url,
    { address, stars, seed: cleanSeed },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const { requestId } = response.data;

  return new Promise((resolve, reject) => {
    const socketInstance = getSocket();
    const timeout = setTimeout(() => {
      socketInstance.off(`entropy:completed`);
      reject(new Error('Request timed out'));
    }, 60000);

    socketInstance.emit('join', `entropy:${requestId}`);

    socketInstance.on('entropy:completed', (data: EntropyCompleted) => {
      if (data.requestId === requestId) {
        clearTimeout(timeout);
        socketInstance.off(`entropy:completed`);
        resolve(data);
      }
    });
  });
};
