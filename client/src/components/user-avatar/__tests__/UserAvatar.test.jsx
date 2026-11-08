import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import UserAvatar from "../UserAvatar";

describe("UserAvatar", () => {
  it("falls back to the default avatar when no image is given", () => {
    render(<UserAvatar alt="demo" />);

    expect(screen.getByAltText("demo")).toHaveAttribute("src", "/img/noavatar.jpg");
  });

  it("uses the provided image", () => {
    render(<UserAvatar img="/img/me.jpg" alt="demo" />);

    expect(screen.getByAltText("demo")).toHaveAttribute("src", "/img/me.jpg");
  });

  it("shows the verified badge only when cardVerified is true", () => {
    const { rerender } = render(<UserAvatar alt="demo" cardVerified={false} />);
    expect(screen.queryByTitle("Verified")).not.toBeInTheDocument();

    rerender(<UserAvatar alt="demo" cardVerified={true} />);
    expect(screen.getByTitle("Verified")).toBeInTheDocument();
  });
});
