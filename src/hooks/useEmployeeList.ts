import { useState, useEffect } from 'react';
import { basicInfoApi, detailsApi } from '../services/api';
import { mergeEmployeeData } from '../utils/mergeEmployeeData';
import type { Employee } from '../types';

export function useEmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch from both APIs in parallel
        const [basicInfoList, detailsList] = await Promise.all([
          basicInfoApi.getAll(),
          detailsApi.getAll(),
        ]);

        // Merge the data
        const mergedEmployees = mergeEmployeeData(basicInfoList, detailsList);
        setEmployees(mergedEmployees);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch employees');
        console.error('Error fetching employees:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return { employees, loading, error };
}
