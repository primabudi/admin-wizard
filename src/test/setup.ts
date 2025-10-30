import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import './mocks';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Suppress CSS parsing errors and act() warnings
const originalConsoleError = console.error;
console.error = (...args) => {
  const message = typeof args[0] === 'string' ? args[0] : '';
  if (
    message.includes('Could not parse CSS stylesheet') ||
    message.includes('Not wrapped in act(')
  ) {
    return;
  }
  originalConsoleError(...args);
};

// Cleanup after each test
afterEach(() => {
  cleanup();
});
