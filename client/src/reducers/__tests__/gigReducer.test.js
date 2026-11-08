import { describe, it, expect } from "vitest";
import { gigReducer, INITIAL_STATE } from "../gigReducer";

describe("gigReducer", () => {
  it("CHANGE_INPUT updates a single field", () => {
    const state = gigReducer(INITIAL_STATE, {
      type: "CHANGE_INPUT",
      payload: { name: "title", value: "House cleaning" },
    });

    expect(state.title).toBe("House cleaning");
    expect(state.cat).toBe(INITIAL_STATE.cat);
  });

  it("ADD_IMAGES sets cover and images", () => {
    const state = gigReducer(INITIAL_STATE, {
      type: "ADD_IMAGES",
      payload: { cover: "cover.jpg", images: ["a.jpg", "b.jpg"] },
    });

    expect(state.cover).toBe("cover.jpg");
    expect(state.images).toEqual(["a.jpg", "b.jpg"]);
  });

  it("ADD_FEATURE appends without mutating the previous state", () => {
    const state = gigReducer(INITIAL_STATE, {
      type: "ADD_FEATURE",
      payload: "Eco-friendly",
    });

    expect(state.features).toEqual(["Eco-friendly"]);
    expect(INITIAL_STATE.features).toEqual([]);
  });

  it("REMOVE_FEATURE removes only the matching feature", () => {
    const withFeatures = { ...INITIAL_STATE, features: ["a", "b", "c"] };

    const state = gigReducer(withFeatures, { type: "REMOVE_FEATURE", payload: "b" });

    expect(state.features).toEqual(["a", "c"]);
  });

  it("TOGGLE_LANGUAGE_VISIBILITY makes exactly one language visible", () => {
    const state = gigReducer(INITIAL_STATE, {
      type: "TOGGLE_LANGUAGE_VISIBILITY",
      payload: { language: "en" },
    });

    expect(state.languageVisibility).toEqual({ en: true, uk: false });
  });

  it("returns the same state for an unknown action", () => {
    const state = gigReducer(INITIAL_STATE, { type: "NOT_A_REAL_ACTION" });

    expect(state).toBe(INITIAL_STATE);
  });
});
