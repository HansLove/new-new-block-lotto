import { useEffect, useState, useCallback } from 'react';
import io from 'socket.io-client';
import { API_URL } from '@/utils/Rutes';
import {
  fetchUserTickets,
  fetchSystemStats,
  fetchTicketDetail,
  fetchTicketAttempts,
  requestTicketHighEntropy,
  type LottoTicket,
  type LottoAttempt,
  type SystemStats,
  type EntropyCompleted,
} from '@/services/lotto';

interface LottoAttemptEvent {
  ticketId: string;
  attempt: {
    id: string;
    blockHeight: number;
    hash: string;
    nonce: string;
    stars: number;
    isBlock: boolean;
    attemptedAt: string;
  };
  ticket: {
    totalAttempts: number;
    lastAttemptAt: string;
  };
}

interface BlockMinedEvent {
  ticketId: string;
  attempt: {
    id: string;
    blockHeight: number;
    hash: string;
    blockHash: string | null;
    attemptedAt: string;
  };
  btcAddress: string;
}

interface UseLottoReturn {
  tickets: LottoTicket[];
  stats: SystemStats | null;
  socket: ReturnType<typeof io> | null;
  isConnected: boolean;
  loading: boolean;
  error: string | null;
  refreshTickets: () => Promise<void>;
  getTicketDetail: (ticketId: string) => Promise<LottoTicket | null>;
  getTicketAttempts: (ticketId: string, limit?: number, skip?: number) => Promise<{ attempts: LottoAttempt[]; pagination: any } | null>;
  requestHighEntropyAttempt: (ticket: LottoTicket, stars?: number, seed?: string) => Promise<EntropyCompleted>;
  highEntropyPending: Record<string, boolean>;
  highEntropyResults: Record<string, EntropyCompleted | null>;
}

export const useLotto = (): UseLottoReturn => {
  const [tickets, setTickets] = useState<LottoTicket[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [highEntropyPending, setHighEntropyPending] = useState<Record<string, boolean>>({});
  const [highEntropyResults, setHighEntropyResults] = useState<Record<string, EntropyCompleted | null>>({});

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token found');
      setLoading(false);
      return;
    }

    const socketInstance = io(API_URL, {
      transports: ['polling', 'websocket'],
      query: { token },
    });

    socketInstance.on('connect', () => {
      console.log('[useLotto] Socket connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('[useLotto] Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('lotto:attempt', (data: LottoAttemptEvent) => {
      console.log('[useLotto] New attempt received:', data);
      // Update ticket in list
      setTickets(prev =>
        prev.map(ticket =>
          ticket.ticketId === data.ticketId
            ? {
                ...ticket,
                totalAttempts: data.ticket.totalAttempts,
                lastAttemptAt: data.ticket.lastAttemptAt,
              }
            : ticket
        )
      );
    });

    socketInstance.on('lotto:block_mined', (data: BlockMinedEvent) => {
      console.log('[useLotto] 🎉 BLOCK MINED!', data);
      // Update ticket and show notification
      setTickets(prev =>
        prev.map(ticket =>
          ticket.ticketId === data.ticketId
            ? {
                ...ticket,
                totalAttempts: ticket.totalAttempts + 1,
              }
            : ticket
        )
      );
    });

    // Handle entropy:completed events for high entropy requests
    socketInstance.on('entropy:completed', (data: EntropyCompleted) => {
      console.log('[useLotto] High entropy completed:', data);
      
      // Find the ticket that matches this address
      setTickets(prev =>
        prev.map(ticket => {
          if (ticket.btcAddress === data.address) {
            // Update ticket with new attempt
            setHighEntropyPending(prevPending => ({ ...prevPending, [ticket.ticketId]: false }));
            setHighEntropyResults(prevResults => ({ ...prevResults, [ticket.ticketId]: data }));
            
            return {
              ...ticket,
              totalAttempts: ticket.totalAttempts + 1,
              lastAttemptAt: new Date().toISOString(),
            };
          }
          return ticket;
        })
      );
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  // Load initial data
  const loadTickets = useCallback(async () => {
    try {
      setLoading(true);
      const [ticketsData, statsData] = await Promise.all([fetchUserTickets(), fetchSystemStats()]);
      setTickets(ticketsData);
      setStats(statsData.stats);
      setError(null);
    } catch (err: any) {
      console.error('[useLotto] Error loading data:', err);
      setError(err.response?.data?.error || 'Failed to load lotto data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const refreshTickets = useCallback(() => {
    return loadTickets();
  }, [loadTickets]);

  const getTicketDetail = useCallback(async (ticketId: string): Promise<LottoTicket | null> => {
    try {
      return await fetchTicketDetail(ticketId);
    } catch (err: any) {
      console.error('[useLotto] Error fetching ticket detail:', err);
      return null;
    }
  }, []);

  const getTicketAttempts = useCallback(
    async (ticketId: string, limit = 50, skip = 0): Promise<{ attempts: LottoAttempt[]; pagination: any } | null> => {
      try {
        return await fetchTicketAttempts(ticketId, limit, skip);
      } catch (err: any) {
        console.error('[useLotto] Error fetching ticket attempts:', err);
        return null;
      }
    },
    []
  );

  /**
   * Request high entropy for a ticket (Plus Ultra feature)
   * @param ticket - The lotto ticket
   * @param stars - Number of stars (default: 12)
   * @param seed - Optional hex seed. If not provided, one will be generated
   * @returns Promise that resolves when entropy is completed
   */
  const requestHighEntropyAttempt = useCallback(
    async (ticket: LottoTicket, stars: number = 12, seed?: string): Promise<EntropyCompleted> => {
      setHighEntropyPending(prev => ({ ...prev, [ticket.ticketId]: true }));
      setHighEntropyResults(prev => ({ ...prev, [ticket.ticketId]: null }));

      try {
        const result = await requestTicketHighEntropy(ticket, stars, seed);
        setHighEntropyPending(prev => ({ ...prev, [ticket.ticketId]: false }));
        setHighEntropyResults(prev => ({ ...prev, [ticket.ticketId]: result }));
        return result;
      } catch (err: any) {
        setHighEntropyPending(prev => ({ ...prev, [ticket.ticketId]: false }));
        throw err;
      }
    },
    []
  );

  return {
    tickets,
    stats,
    socket,
    isConnected,
    loading,
    error,
    refreshTickets,
    getTicketDetail,
    getTicketAttempts,
    requestHighEntropyAttempt,
    highEntropyPending,
    highEntropyResults,
  };
};
