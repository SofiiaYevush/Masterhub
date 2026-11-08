import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import AlertMessage from "../AlertMessage";

describe("AlertMessage", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it("renders the message", () => {
    render(<AlertMessage message="Something happened" />);

    expect(screen.getByText("Something happened")).toBeInTheDocument();
  });

  it("auto-dismisses after the given duration and calls onClose", () => {
    const onClose = vi.fn();
    render(<AlertMessage message="Bye soon" duration={1000} onClose={onClose} />);

    expect(screen.getByText("Bye soon")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.queryByText("Bye soon")).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("defaults to a 3000ms duration", () => {
    const onClose = vi.fn();
    render(<AlertMessage message="x" onClose={onClose} />);

    act(() => {
      vi.advanceTimersByTime(2999);
    });
    expect(onClose).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
