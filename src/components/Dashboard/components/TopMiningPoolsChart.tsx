import axios from 'axios';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { API_URL, RUTE_GET_MINING_POOLS_DATA } from '@/utils/Rutes';

export default function TopMiningPoolsChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const res = await axios.get(API_URL + RUTE_GET_MINING_POOLS_DATA);
        const pools = res.data.data;

        const cleaned = pools
          .filter((pool: any) => pool.hashrate && pool.country)
          .map((pool: any) => ({
            name: new URL(pool.url).hostname.replace('www.', ''),
            hashrate: parseFloat((pool.hashrate / 1e15).toFixed(2)), // PH/s
          }))
          .sort((a: any, b: any) => b.hashrate - a.hashrate)
          .slice(0, 10); // Top 10

        setData(cleaned);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching top pools:', err);
        setLoading(false);
      }
    };

    fetchPools();
  }, []);

  return (
    <div className="rounded-xl bg-[#1a1a2e] p-4 shadow-xl">
      <h2 className="mb-2 text-lg font-semibold text-white">Top Mining Pools (PH/s)</h2>
      {loading ? (
        <p className="text-gray-400">Loading data...</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2d2d44" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" unit=" PH/s" />
            <Tooltip formatter={(value: number) => `${value} PH/s`} />
            <Bar dataKey="hashrate" fill="#a8dadc" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
