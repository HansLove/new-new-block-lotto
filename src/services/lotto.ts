import axios from 'axios';
import { API_URL } from '@/utils/Rutes';
import {
  requestLowEntropy,
  requestHighEntropy,
  generateHexSeed,
  type LowEntropyResponse,
  type EntropyCompleted,
} from './entropy';

// Re-export types that are used by consumers
export type { EntropyCompleted, LowEntropyResponse };

export interface LottoTicket {
  id: string;
  ticketId: string;
  btcAddress: string;
  status: 'active' | 'expired' | 'suspended';
  validUntil: string;
  frequencyMinutes: number;
  stars: number;
  totalAttempts: number;
  lastAttemptAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LottoAttempt {
  id: string;
  blockHeight: number;
  hash: string;
  nonce: string;
  stars: number;
  isBlock: boolean;
  blockHash: string | null;
  merkleRoot: string | null;
  prevHash: string | null;
  bits: string | null;
  timestamp: number | null;
  attemptedAt: string;
}

export interface SystemStats {
  totalActiveTickets: number;
  totalAttempts: number;
  totalBlocksMined: number;
  lastBlockHeight: number | null;
  difficulty?: string;
}

export interface CreateTicketRequest {
  btcAddress: string;
  validDays?: number;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };
};

export const fetchUserTickets = async (): Promise<LottoTicket[]> => {
  const response = await axios.get(`${API_URL}api/lotto/tickets`, getAuthHeaders());
  return response.data.tickets || [];
};

export const createTicket = async (data: CreateTicketRequest): Promise<LottoTicket> => {
  const response = await axios.post(`${API_URL}api/lotto/tickets`, data, getAuthHeaders());
  return response.data.ticket;
};

export const fetchTicketDetail = async (ticketId: string): Promise<LottoTicket> => {
  const response = await axios.get(`${API_URL}api/lotto/tickets/${ticketId}`, getAuthHeaders());
  return response.data.ticket;
};

export const fetchTicketAttempts = async (
  ticketId: string,
  limit = 50,
  skip = 0
): Promise<{ attempts: LottoAttempt[]; pagination: { total: number; limit: number; skip: number; hasMore: boolean } }> => {
  const response = await axios.get(`${API_URL}api/lotto/tickets/${ticketId}/attempts`, {
    ...getAuthHeaders(),
    params: { limit, skip },
  });
  return response.data;
};

export const fetchSystemStats = async (): Promise<{
  stats: SystemStats;
  recentAttempts: Array<{
    ticketId: string;
    blockHeight: number;
    hash: string;
    stars: number;
    isBlock: boolean;
    attemptedAt: string;
  }>;
}> => {
  const response = await axios.get(`${API_URL}api/lotto/stats`, getAuthHeaders());
  return response.data;
};

/**
 * Request high entropy for a lotto ticket (Plus Ultra feature)
 * @param ticket - The lotto ticket object
 * @param stars - Number of stars (default: 12)
 * @param seed - Optional hex seed (8 characters). If not provided, one will be generated
 * @returns Promise with entropy completion data
 */
export const requestTicketHighEntropy = async (
  ticket: LottoTicket,
  stars: number = 12,
  seed?: string
): Promise<EntropyCompleted> => {
  const hexSeed = seed || generateHexSeed();
  return await requestHighEntropy(ticket.btcAddress, stars, hexSeed);
};

/**
 * Request low entropy for a lotto ticket (manual attempt)
 * @param ticket - The lotto ticket object
 * @param stars - Number of stars (default: 5)
 * @returns Promise with low entropy response
 */
export const requestTicketLowEntropy = async (
  ticket: LottoTicket,
  stars: number = 5
): Promise<LowEntropyResponse> => {
  return await requestLowEntropy(ticket.btcAddress, stars);
};

