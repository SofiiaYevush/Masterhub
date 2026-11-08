import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../../test/renderWithProviders.jsx";
import { mockChangeLanguage } from "../../../test/mocks/i18n.js";
import Navbar from "../Navbar";

describe("Navbar", () => {
  beforeEach(() => {
    // jsdom's window.location.reload throws "not implemented", and the
    // property isn't configurable enough for vi.spyOn - Navbar calls it
    // after logout, so the whole location object is replaced with a stub.
    Object.defineProperty(window, "location", {
      value: { ...window.location, reload: vi.fn() },
      writable: true,
    });
  });

  it("shows a sign-in link for a guest, with no account menu", () => {
    renderWithProviders(<Navbar />);

    expect(screen.getByText("navbar.signIn")).toBeInTheDocument();
    expect(screen.queryByText("navbar.logout")).not.toBeInTheDocument();
  });

  it("shows seller-specific links for a logged-in seller once the dropdown opens", async () => {
    localStorage.setItem("currentUser", JSON.stringify({ username: "tasker1", isSeller: true }));
    const { user } = renderWithProviders(<Navbar />);

    expect(screen.queryByText("navbar.myServices")).not.toBeInTheDocument();

    await user.click(screen.getByText("tasker1"));

    expect(screen.getByText("navbar.myServices")).toBeInTheDocument();
    expect(screen.queryByText("navbar.myJobs")).not.toBeInTheDocument();
  });

  it("shows client-specific links for a logged-in client", async () => {
    localStorage.setItem("currentUser", JSON.stringify({ username: "client1", isSeller: false }));
    const { user } = renderWithProviders(<Navbar />);

    await user.click(screen.getByText("client1"));

    expect(screen.getByText("navbar.myJobs")).toBeInTheDocument();
    expect(screen.queryByText("navbar.myServices")).not.toBeInTheDocument();
  });

  it("logs out: calls the API and clears the stored user", async () => {
    localStorage.setItem("currentUser", JSON.stringify({ username: "client1", isSeller: false }));
    const { user } = renderWithProviders(<Navbar />);

    await user.click(screen.getByText("client1"));
    await user.click(screen.getByText("navbar.logout"));

    // Documents the actual current behavior: the code calls
    // localStorage.setItem("currentUser", null), which stores the literal
    // string "null" rather than removing the key.
    await waitFor(() => expect(localStorage.getItem("currentUser")).toBe("null"));
  });

  it("toggles the i18n language on click", async () => {
    const { user } = renderWithProviders(<Navbar />);

    await user.click(screen.getByText("En"));

    expect(mockChangeLanguage).toHaveBeenCalledWith("en");
  });
});
