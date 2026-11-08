import React from "react";
import { describe, it, expect, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { screen, waitFor } from "@testing-library/react";
import { server } from "../../../test/mocks/server.js";
import { apiUrl } from "../../../test/mocks/handlers.js";
import { renderWithProviders } from "../../../test/renderWithProviders.jsx";
import Login from "../Login";

const fillAndSubmit = async (user, { username, password }) => {
  await user.type(screen.getByPlaceholderText("login.placeholderUsername"), username);
  // The password field has no placeholder in the markup, so target it by type.
  const passwordInput = document.querySelector('input[name="password"]');
  await user.type(passwordInput, password);
  await user.click(screen.getByText("login.submitBtn"));
};

describe("Login page", () => {
  it("logs a client in: stores the user and navigates home", async () => {
    server.use(
      http.post(apiUrl("/auth/login"), () =>
        HttpResponse.json({ _id: "u1", username: "client1", isAdmin: false })
      )
    );
    const { user } = renderWithProviders(<Login />);

    await fillAndSubmit(user, { username: "client1", password: "Password123!" });

    await waitFor(() => {
      expect(JSON.parse(localStorage.getItem("currentUser")).username).toBe("client1");
    });
  });

  it("shows an alert on invalid credentials and does not store a user", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    server.use(
      http.post(apiUrl("/auth/login"), () => HttpResponse.text("Wrong password!", { status: 400 }))
    );
    const { user } = renderWithProviders(<Login />);

    await fillAndSubmit(user, { username: "client1", password: "wrong" });

    await waitFor(() =>
      expect(screen.getByText("login.alertMessage")).toBeInTheDocument()
    );
    expect(localStorage.getItem("currentUser")).toBeNull();
  });
});
