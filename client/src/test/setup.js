import "@testing-library/jest-dom/vitest";
import { afterEach, afterAll, beforeAll, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import { server } from "./mocks/server.js";
import { mockT, mockChangeLanguage } from "./mocks/i18n.js";

// react-i18next's real init (src/config/i18n.jsx) fetches translation JSON
// over the network via i18next-http-backend, which has no place in a unit
// test. Components only need `t(key)` to return something stable and
// `i18n.language`/`changeLanguage` to exist - this keeps every test fast and
// network-free without touching the many call sites that use useTranslation.
// mockT/mockChangeLanguage are imported (not declared here) so a test file
// can import the same references to assert on changeLanguage calls.
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: mockT,
    i18n: { language: "uk", changeLanguage: mockChangeLanguage },
  }),
  initReactI18next: { type: "3rdParty", init: () => {} },
  Trans: ({ children }) => children,
}));

// jsdom has no matchMedia implementation; a few MUI internals probe it.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });
}

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  cleanup();
  localStorage.clear();
  mockChangeLanguage.mockClear();
});
afterAll(() => server.close());
