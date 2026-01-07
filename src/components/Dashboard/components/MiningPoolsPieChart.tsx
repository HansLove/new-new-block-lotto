import axios from 'axios';
import { useEffect, useState } from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { API_URL, RUTE_GET_MINING_POOLS_DATA } from '@/utils/Rutes';

const COLORS = ['#e63946', '#f1faee', '#a8dadc', '#457b9d', '#ffbe0b', '#8338ec', '#3a86ff'];

export default function MiningPoolsPieChart() {
  const [dataPie, setDataPie] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const res = await axios.get(API_URL + RUTE_GET_MINING_POOLS_DATA);
        const rawPools = res.data.data;

        // Parse pool countries and accumulate hashrate per country
        const hashratePerCountry: any = {};

        rawPools.forEach((pool: any) => {
          const countries = pool.country?.split(',') || ['Other'];
          const hashrate = pool.hashrate || 0;

          countries.forEach((countryRaw: any) => {
            const country = countryRaw.trim().replace(/\|.*/, '') || 'Other';
            if (!hashratePerCountry[country]) {
              hashratePerCountry[country] = 0;
            }
            hashratePerCountry[country] += hashrate;
          });
        });

        const total = Object.values(hashratePerCountry).reduce((a: number, b: any) => a + b, 0);

        const parsedData: any = Object.entries(hashratePerCountry)
          .map(([name, value]: any) => ({
            name,
            value: parseFloat(((value / total) * 100).toFixed(2)),
          }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8); // Top 8 countries

        setDataPie(parsedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching mining pool data:', error);
        setLoading(false);
      }
    };

    fetchPools();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-400">Loading market share data...</p>;
  }

  return (
    <div className="rounded-xl bg-[#1a1a2e] p-4 shadow-xl">
      <h2 className="mb-4 text-center text-lg font-semibold">Mining Pool Market Share by Country</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={dataPie}
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            // label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`}
          >
            {dataPie.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(val: number) => `${val}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
