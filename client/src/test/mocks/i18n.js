import { vi } from "vitest";

// Shared across every render of useTranslation() in a test run, so a test
// can import these directly to assert on calls (e.g. a language-toggle
// button calling changeLanguage("en")).
export const mockChangeLanguage = vi.fn();
export const mockT = (key) => key;
