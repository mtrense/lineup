import "@testing-library/jest-dom/vitest";

// Mock ResizeObserver for radix-ui components
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
