import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CenterCard from '@/components/CenterCard';
import data from '@/data/recycling_centers_in.json';
import { motion } from 'framer-motion';

// Define the number of centres shown per page
const PAGE_SIZE = 10;

// Type inference for centre entries
type Center = {
  name: string;
  city: string;
  verified: boolean;
  address: string;
  phone: string | null;
  maps_link?: string | null;
};

export default function RecyclingCenters() {
  const centers: Center[] = data as Center[];
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('All');

  // Derive unique city list for the dropdown
  const cities = useMemo(() => {
    const unique = Array.from(new Set(centers.map((c) => c.city)));
    return ['All', ...unique.sort()];
  }, [centers]);

  // Filter centres based on search and city
  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return centers.filter((c) => {
      const matchSearch = !s || c.name.toLowerCase().includes(s) || c.address.toLowerCase().includes(s) || c.city.toLowerCase().includes(s);
      const matchCity = city === 'All' || c.city === city;
      return matchSearch && matchCity;
    });
  }, [centers, search, city]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const start = page * PAGE_SIZE;
  const current = filtered.slice(start, start + PAGE_SIZE);

  const go = (delta: number) => {
    setPage((p) => {
      const next = p + delta;
      if (next < 0) return 0;
      if (next >= totalPages) return totalPages - 1;
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-8 pb-16">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="font-heading font-bold text-4xl md:text-5xl text-foreground mb-3">
            Recycling Centers
          </h1>
          <p className="font-body text-xl text-muted-foreground max-w-3xl mx-auto">
            Find verified e-waste recycling centers across India. Use search and city filters to narrow down the list. Ten centres are displayed per page.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center mb-2">
              <h2 className="font-heading font-semibold text-lg text-foreground">Filter Centers</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search by name, address or city..."
                value={search}
                onChange={(e) => {
                  setPage(0);
                  setSearch(e.target.value);
                }}
                className="rounded-lg border p-2 bg-background"
              />
              <select
                value={city}
                onChange={(e) => {
                  setPage(0);
                  setCity(e.target.value);
                }}
                className="rounded-lg border p-2 bg-background"
              >
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="self-center text-sm text-muted-foreground">
                Showing {current.length} of {filtered.length} centres (page {page + 1}/{totalPages})
              </div>
            </div>
          </div>
        </motion.div>

        {/* Centres list */}
        <div className="mx-auto max-w-3xl grid gap-5 grid-cols-1 mt-6 px-4 sm:px-6 lg:px-8">
          {current.map((c) => (
            <CenterCard key={`${c.name}-${c.city}`} c={c} />
          ))}
        </div>

        {/* Pagination controls */}
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`px-3 py-1.5 rounded-full text-sm border ${i === page ? 'bg-gradient-to-r from-brand-500 to-emerald-400 text-white' : 'hover:bg-accent'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
