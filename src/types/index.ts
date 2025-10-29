export interface Department {
  id: number;
  name: string;
}

export interface Location {
  id: number;
  name: string;
}

export interface BasicInfo {
  id?: number;
  fullName: string;
  email: string;
  department: string;
  role: string;
  employeeId: string;
}

export interface Details {
  id?: number;
  email: string;
  employeeId: string;
  photo?: string;
  employmentType: string;
  officeLocation: string;
  notes?: string;
}

export interface Employee extends BasicInfo {
  photo?: string;
  employmentType?: string;
  officeLocation?: string;
  notes?: string;
}

export type UserRole = 'admin' | 'ops';

export const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Contract', 'Intern'] as const;
export type EmploymentType = typeof EMPLOYMENT_TYPES[number];

export const ROLES = ['Admin', 'Engineer', 'Ops', 'Finance'] as const;
export type Role = typeof ROLES[number];
