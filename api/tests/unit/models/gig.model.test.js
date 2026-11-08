import { describe, it, expect } from "vitest";
import Gig from "../../../models/gig.model.js";
import { buildGigPayload } from "../../factories/gig.factory.js";

describe("Gig model", () => {
  it("accepts a fully valid gig", () => {
    const gig = new Gig(buildGigPayload());

    expect(gig.validateSync()).toBeUndefined();
  });

  it("requires a price unless isPriceNegotiable is true", () => {
    const gig = new Gig(buildGigPayload({ price: undefined, isPriceNegotiable: false }));

    expect(gig.validateSync().errors.price).toBeDefined();
  });

  it("does not require a price when isPriceNegotiable is true", () => {
    const gig = new Gig(buildGigPayload({ price: undefined, isPriceNegotiable: true }));

    expect(gig.validateSync()).toBeUndefined();
  });

  it("defaults totalStars, starNumber and sales to 0", () => {
    const gig = new Gig(buildGigPayload());

    expect(gig.totalStars).toBe(0);
    expect(gig.starNumber).toBe(0);
    expect(gig.sales).toBe(0);
  });

  it("requires title, desc, cat, cover, shortTitle, shortDesc, deliveryTime and location", () => {
    const err = new Gig({}).validateSync();

    ["title", "desc", "cat", "cover", "shortTitle", "shortDesc", "deliveryTime", "location"].forEach(
      (field) => expect(err.errors[field], field).toBeDefined()
    );
  });

  it("defaults languageVisibility to { en: false, uk: true }", () => {
    const gig = new Gig(buildGigPayload({ languageVisibility: undefined }));

    expect(gig.languageVisibility.en).toBe(false);
    expect(gig.languageVisibility.uk).toBe(true);
  });
});
