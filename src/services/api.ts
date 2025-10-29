import axios from 'axios';
import type { Department, Location, BasicInfo, Details } from '../types';

const API_BASE_URL_STEP1 = 'http://localhost:4001';
const API_BASE_URL_STEP2 = 'http://localhost:4002';

const apiStep1 = axios.create({
  baseURL: API_BASE_URL_STEP1,
});

const apiStep2 = axios.create({
  baseURL: API_BASE_URL_STEP2,
});

export const departmentApi = {
  getDepartments: async (search?: string): Promise<Department[]> => {
    const params = search ? { name_like: search } : {};
    const response = await apiStep1.get<Department[]>('/departments', { params });
    return response.data;
  },
};

export const locationApi = {
  getLocations: async (search?: string): Promise<Location[]> => {
    const params = search ? { name_like: search } : {};
    const response = await apiStep2.get<Location[]>('/locations', { params });
    return response.data;
  },
};

export const basicInfoApi = {
  getAll: async (): Promise<BasicInfo[]> => {
    const response = await apiStep1.get<BasicInfo[]>('/basicInfo');
    return response.data;
  },

  getById: async (id: number): Promise<BasicInfo> => {
    const response = await apiStep1.get<BasicInfo>(`/basicInfo/${id}`);
    return response.data;
  },

  create: async (data: BasicInfo): Promise<BasicInfo> => {
    const response = await apiStep1.post<BasicInfo>('/basicInfo', data);
    return response.data;
  },

  update: async (id: number, data: Partial<BasicInfo>): Promise<BasicInfo> => {
    const response = await apiStep1.patch<BasicInfo>(`/basicInfo/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiStep1.delete(`/basicInfo/${id}`);
  },
};

export const detailsApi = {
  getAll: async (): Promise<Details[]> => {
    const response = await apiStep2.get<Details[]>('/details');
    return response.data;
  },

  getById: async (id: number): Promise<Details> => {
    const response = await apiStep2.get<Details>(`/details/${id}`);
    return response.data;
  },

  create: async (data: Details): Promise<Details> => {
    const response = await apiStep2.post<Details>('/details', data);
    return response.data;
  },

  update: async (id: number, data: Partial<Details>): Promise<Details> => {
    const response = await apiStep2.patch<Details>(`/details/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiStep2.delete(`/details/${id}`);
  },
};

export const wizardApi = {
  submitWizard: async (
    basicInfo: BasicInfo,
    details: Details
  ): Promise<{ basicInfo: BasicInfo; details: Details }> => {
    const basicInfoResponse = await basicInfoApi.create(basicInfo);
    const detailsResponse = await detailsApi.create(details);

    return {
      basicInfo: basicInfoResponse,
      details: detailsResponse,
    };
  },
};
