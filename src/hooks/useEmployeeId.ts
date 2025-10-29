import { useEffect, useState } from 'react';
import { basicInfoApi } from '../services/api';
import type { BasicInfo } from '../types';

interface UseEmployeeIdOptions {
  department: string;
  onIdGenerated: (employeeId: string) => void;
}

/**
 * Generates employee ID based on department name and sequence
 * Format: <3-letter dept>-<3-digit seq> (e.g., ENG-003)
 */
function generateEmployeeId(department: string, sequence: number): string {
  const deptCode = department.substring(0, 3).toUpperCase();
  const seqNumber = sequence.toString().padStart(3, '0');
  return `${deptCode}-${seqNumber}`;
}

/**
 * Gets the next sequence number for a department
 */
function getNextSequenceForDepartment(
  department: string,
  existingEmployees: BasicInfo[]
): number {
  const deptCode = department.substring(0, 3).toUpperCase();

  // Filter employees from the same department
  const deptEmployees = existingEmployees.filter((emp) =>
    emp.employeeId.startsWith(deptCode)
  );

  if (deptEmployees.length === 0) {
    return 1;
  }

  // Extract sequence numbers and find the maximum
  const sequences = deptEmployees.map((emp) => {
    const parts = emp.employeeId.split('-');
    return parseInt(parts[1] || '0', 10);
  });

  const maxSequence = Math.max(...sequences);
  return maxSequence + 1;
}

export function useEmployeeId({ department, onIdGenerated }: UseEmployeeIdOptions) {
  const [existingEmployees, setExistingEmployees] = useState<BasicInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch existing employees on mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        const employees = await basicInfoApi.getAll();
        setExistingEmployees(employees);
        setError(null);
      } catch (err) {
        setError('Failed to fetch existing employees');
        console.error('Failed to fetch existing employees:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  // Auto-generate employee ID when department changes
  useEffect(() => {
    if (department && !isLoading) {
      const sequence = getNextSequenceForDepartment(department, existingEmployees);
      const employeeId = generateEmployeeId(department, sequence);
      onIdGenerated(employeeId);
    }
  }, [department, existingEmployees, isLoading, onIdGenerated]);

  return { isLoading, error };
}
