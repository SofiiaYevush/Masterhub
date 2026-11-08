import { describe, it, expect } from "vitest";
import { getBannerContent } from "../getBannerContent";

describe("getBannerContent", () => {
  it("returns the guest banner when there is no user", () => {
    const content = getBannerContent(null);

    expect(content.link).toBe("/pre-registerer");
    expect(content.titleKey).toBe("banner.guest.title");
  });

  it("returns the tasker banner for a seller", () => {
    const content = getBannerContent({ isSeller: true });

    expect(content.link).toBe("/categories");
    expect(content.titleKey).toBe("banner.tasker.title");
  });

  it("returns the client banner for a non-seller user", () => {
    const content = getBannerContent({ isSeller: false });

    expect(content.link).toBe("/create-jobs");
    expect(content.titleKey).toBe("banner.client.title");
  });
});
