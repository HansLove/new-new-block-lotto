import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Clock, RefreshCw, Shield, Activity } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLotto } from '@/hooks/useLotto';
import type { LottoAttempt } from '@/services/lotto';

export default function TicketDetail() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { getTicketDetail, getTicketAttempts, stats } = useLotto();
  const [ticket, setTicket] = useState<any>(null);
  const [attempts, setAttempts] = useState<LottoAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextAttemptTime, setNextAttemptTime] = useState<string>('--:--');
  const [probability, setProbability] = useState<string>('1 : 12,400');

  useEffect(() => {
    if (!ticketId) return;

    const loadData = async () => {
      try {
        setLoading(true);
        const [ticketData, attemptsData] = await Promise.all([
          getTicketDetail(ticketId),
          getTicketAttempts(ticketId, 20, 0),
        ]);

        if (ticketData) {
          setTicket(ticketData);
        }

        if (attemptsData) {
          setAttempts(attemptsData.attempts);
        }
      } catch (error) {
        console.error('Error loading ticket detail:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [ticketId, getTicketDetail, getTicketAttempts]);

  useEffect(() => {
    if (!ticket) return;

    const updateCountdown = () => {
      if (!ticket.lastAttemptAt) {
        setNextAttemptTime('Now');
        return;
      }

      const lastAttempt = new Date(ticket.lastAttemptAt);
      const nextAttempt = new Date(lastAttempt.getTime() + ticket.frequencyMinutes * 60 * 1000);
      const now = new Date();
      const diff = nextAttempt.getTime() - now.getTime();

      if (diff <= 0) {
        setNextAttemptTime('Now');
      } else {
        const hours = Math.floor(diff / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);

        if (hours > 0) {
          setNextAttemptTime(`${hours}h ${minutes}m`);
        } else if (minutes > 0) {
          setNextAttemptTime(`${minutes}m ${seconds}s`);
        } else {
          setNextAttemptTime(`${seconds}s`);
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [ticket]);

  useEffect(() => {
    // Calculate probability based on total attempts and blocks mined
    if (stats && ticket) {
      const totalAttempts = stats.totalAttempts || 1;
      const blocksMined = stats.totalBlocksMined || 0;
      const estimatedProbability = Math.round(totalAttempts / Math.max(blocksMined, 1));
      setProbability(`1 : ${estimatedProbability.toLocaleString()}`);
    }
  }, [stats, ticket]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-yellow-500/30 border-t-yellow-500" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400">Ticket not found</p>
          <button onClick={() => navigate('/lotto')} className="mt-4 text-yellow-500 hover:text-yellow-400">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const isActive = ticket.status === 'active' && new Date(ticket.validUntil) > new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 pb-20">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-4"
        >
          <button
            onClick={() => navigate('/lotto')}
            className="rounded-lg bg-slate-800/50 p-2 text-white transition-colors hover:bg-slate-700/50"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Block-Lotto</h1>
            <p className="text-sm text-gray-400">OFFICIAL ENTRY</p>
          </div>
          <div className={`ml-auto rounded-full px-4 py-2 ${isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-400'}`} />
              <span className="text-xs font-semibold">{isActive ? 'PARTICIPATING' : 'INACTIVE'}</span>
            </div>
          </div>
        </motion.div>

        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <p className="mb-2 text-xs uppercase text-gray-500">CURRENT STATUS</p>
          <div className="flex items-center gap-2">
            <CheckCircle2 className={`h-6 w-6 ${isActive ? 'text-green-400' : 'text-gray-400'}`} />
            <h2 className="text-2xl font-bold text-white">Active Ticket</h2>
          </div>
        </motion.div>

        {/* Ticket ID Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 rounded-2xl bg-white p-6 shadow-lg"
        >
          <p className="mb-2 text-xs uppercase text-gray-500">TICKET ID</p>
          <h3 className="mb-2 text-3xl font-bold text-gray-900">{ticket.ticketId}</h3>
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>Cryptographically verified unique entry</span>
          </div>
          <button className="mt-4 flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white">
            <Shield className="h-4 w-4" />
            VERIFIABLE
          </button>
        </motion.div>

        {/* Frequency and Validity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 grid grid-cols-2 gap-4"
        >
          <div className="rounded-2xl bg-white p-4 shadow-lg">
            <p className="mb-2 text-xs uppercase text-gray-500">FREQUENCY</p>
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-orange-500" />
              <span className="text-xl font-bold text-gray-900">{ticket.frequencyMinutes} Mins</span>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-4 shadow-lg">
            <p className="mb-2 text-xs uppercase text-gray-500">VALIDITY</p>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="text-xl font-bold text-gray-900">
                {Math.ceil((new Date(ticket.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} Days
              </span>
            </div>
          </div>
        </motion.div>

        {/* Automatic Entry Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 rounded-2xl bg-white p-4 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <Activity className="h-5 w-5 text-blue-500" />
            <p className="text-sm text-gray-700">
              This ticket automatically enters you into every participation round while active.
            </p>
          </div>
        </motion.div>

        {/* System Live Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-xl"
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
              <span className="text-xs uppercase text-gray-400">SYSTEM LIVE</span>
            </div>
            {stats && (
              <div className="text-sm text-orange-400">
                BLOCK #{stats.lastBlockHeight?.toLocaleString() || '---'}
              </div>
            )}
          </div>
          <div className="mb-4">
            <p className="mb-2 text-xs uppercase text-gray-400">NEXT ATTEMPT</p>
            <p className="text-4xl font-bold">{nextAttemptTime}</p>
          </div>
          <div className="flex items-center justify-end">
            <div className="text-right">
              <p className="text-xs uppercase text-gray-400">PROBABILITY</p>
              <p className="text-lg font-semibold">{probability}</p>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6 flex items-start gap-2 rounded-lg bg-yellow-500/10 p-4 text-sm text-yellow-400"
        >
          <span>ℹ️</span>
          <p>Block-Lotto is a probability-based system. Possession of this ticket confirms participation but does not guarantee specific results.</p>
        </motion.div>

        {/* Recent Attempts */}
        {attempts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl bg-slate-900/50 p-6"
          >
            <h3 className="mb-4 text-lg font-semibold text-white">Recent Attempts</h3>
            <div className="space-y-3">
              {attempts.slice(0, 5).map((attempt) => (
                <div key={attempt.id} className="rounded-lg bg-slate-800/50 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Block Height: {attempt.blockHeight}</p>
                      <p className="text-xs font-mono text-gray-500">{attempt.hash.substring(0, 16)}...</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">{attempt.stars} ⭐</span>
                      </div>
                      {attempt.isBlock && (
                        <span className="mt-1 block text-xs font-semibold text-green-400">BLOCK MINED!</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate(`/lotto/${ticketId}/activity`)}
              className="mt-4 w-full rounded-lg bg-white px-4 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100"
            >
              <Activity className="mr-2 inline h-4 w-4" />
              View System Activity
            </button>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 flex items-center justify-between text-sm text-gray-500"
        >
          <span>{new Date().toLocaleDateString()}</span>
          <span>PD: $10.00 USD</span>
        </motion.div>
      </div>
    </div>
  );
}

