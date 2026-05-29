import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchAllIssues, fetchRecentEvents, computeAnalystStats, scoreAnalyst } from '../services/github';

const CACHE_KEY = 'soc_cache';
const CACHE_TS_KEY = 'soc_cache_ts';

export function useSOCData() {
  const [analysts, setAnalysts] = useState([]);
  const [recentIssues, setRecentIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const intervalRef = useRef(null);

  const load = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      // Check cache
      if (!forceRefresh) {
        const cached = localStorage.getItem(CACHE_KEY);
        const ts = localStorage.getItem(CACHE_TS_KEY);
        const refreshMin = parseInt(localStorage.getItem('soc_refresh') || '5');
        if (cached && ts) {
          const age = (Date.now() - parseInt(ts)) / 1000 / 60;
          if (age < refreshMin) {
            const data = JSON.parse(cached);
            setAnalysts(data.analysts || []);
            setRecentIssues(data.recentIssues || []);
            setLastUpdated(new Date(parseInt(ts)));
            setLoading(false);
            return;
          }
        }
      }

      const [allIssues, recent] = await Promise.all([
        fetchAllIssues(),
        fetchRecentEvents(),
      ]);

      const stats = computeAnalystStats(allIssues);
      const ranked = stats.sort((a, b) => scoreAnalyst(b) - scoreAnalyst(a));

      const cacheData = { analysts: ranked, recentIssues: recent };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      localStorage.setItem(CACHE_TS_KEY, Date.now().toString());

      setAnalysts(ranked);
      setRecentIssues(recent);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh
  useEffect(() => {
    const refreshMin = parseInt(localStorage.getItem('soc_refresh') || '5');
    if (refreshMin === 0) return; // manual only

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => load(true), refreshMin * 60 * 1000);
    return () => clearInterval(intervalRef.current);
  }, [load]);

  // Initial load
  useEffect(() => {
    const owner = localStorage.getItem('soc_owner');
    const token = localStorage.getItem('soc_token');
    if (owner && token) load();
  }, [load]);

  const refresh = () => load(true);
  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TS_KEY);
    load(true);
  };

  return { analysts, recentIssues, loading, error, lastUpdated, refresh, clearCache };
}
