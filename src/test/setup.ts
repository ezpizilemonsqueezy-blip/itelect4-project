import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Unmount rendered components and undo every vi.spyOn between tests.
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  localStorage.clear();
});
