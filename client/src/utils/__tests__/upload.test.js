import { describe, it, expect, vi, afterEach } from "vitest";

// upload.js calls axios.post directly (not the newRequest instance), so it's
// mocked here rather than routed through MSW.
const { mockPost } = vi.hoisted(() => ({ mockPost: vi.fn() }));
vi.mock("axios", () => ({ default: { post: mockPost } }));

import upload from "../upload";

describe("upload", () => {
  afterEach(() => mockPost.mockReset());

  it("returns the uploaded file's url on success", async () => {
    mockPost.mockResolvedValue({ data: { url: "https://res.cloudinary.com/x.jpg" } });

    const url = await upload(new File(["content"], "photo.png", { type: "image/png" }));

    expect(url).toBe("https://res.cloudinary.com/x.jpg");
    expect(mockPost).toHaveBeenCalledWith(expect.any(String), expect.any(FormData));
  });

  it("returns undefined and logs rather than throwing when the upload fails", async () => {
    mockPost.mockRejectedValue(new Error("network error"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const url = await upload(new File(["content"], "photo.png"));

    expect(url).toBeUndefined();
  });
});
