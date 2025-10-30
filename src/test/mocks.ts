import { vi } from 'vitest';

// Global API mocks
vi.mock('../services/api', () => ({
  departmentApi: {
    getDepartments: vi.fn(() => Promise.resolve([])),
  },
  locationApi: {
    getLocations: vi.fn(() => Promise.resolve([])),
  },
  basicInfoApi: {
    create: vi.fn(),
    getAll: vi.fn(() => Promise.resolve([])),
  },
  detailsApi: {
    create: vi.fn(),
    getAll: vi.fn(() => Promise.resolve([])),
  },
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useSearchParams: () => [new URLSearchParams('?role=admin'), vi.fn()],
  };
});

// Mock toaster
vi.mock('../components/ui/toaster', () => ({
  toaster: {
    create: vi.fn(),
  },
}));
