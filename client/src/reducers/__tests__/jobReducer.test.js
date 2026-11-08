import { describe, it, expect } from "vitest";
import { jobReducer, INITIAL_STATE } from "../jobReducer";

describe("jobReducer", () => {
  it("CHANGE_INPUT updates a single field", () => {
    const state = jobReducer(INITIAL_STATE, {
      type: "CHANGE_INPUT",
      payload: { name: "title", value: "Need a plumber" },
    });

    expect(state.title).toBe("Need a plumber");
  });

  it("ADD_SKILL appends without mutating the previous state", () => {
    const state = jobReducer(INITIAL_STATE, { type: "ADD_SKILL", payload: "plumbing" });

    expect(state.skills).toEqual(["plumbing"]);
    expect(INITIAL_STATE.skills).toEqual([]);
  });

  it("REMOVE_SKILL removes only the matching skill", () => {
    const withSkills = { ...INITIAL_STATE, skills: ["plumbing", "electrician"] };

    const state = jobReducer(withSkills, { type: "REMOVE_SKILL", payload: "plumbing" });

    expect(state.skills).toEqual(["electrician"]);
  });

  it("TOGGLE_LANGUAGE_VISIBILITY makes exactly one language visible", () => {
    const state = jobReducer(INITIAL_STATE, {
      type: "TOGGLE_LANGUAGE_VISIBILITY",
      payload: { language: "en" },
    });

    expect(state.languageVisibility).toEqual({ uk: false, en: true });
  });

  it("returns the same state for an unknown action", () => {
    const state = jobReducer(INITIAL_STATE, { type: "NOT_A_REAL_ACTION" });

    expect(state).toBe(INITIAL_STATE);
  });
});
