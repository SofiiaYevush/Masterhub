import React from "react";
import { describe, it, expect, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { screen, waitFor } from "@testing-library/react";
import { server } from "../../../test/mocks/server.js";
import { apiUrl } from "../../../test/mocks/handlers.js";
import { renderWithProviders } from "../../../test/renderWithProviders.jsx";
import GigCard from "../GigCard";

const baseItem = {
  _id: "gig1",
  userId: "seller1",
  title: "Deep house cleaning",
  cover: "https://example.com/cover.jpg",
  price: 500,
  isPriceNegotiable: false,
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("GigCard", () => {
  it("shows the seller's username once it loads", async () => {
    server.use(
      http.get(apiUrl("/users/:id"), () =>
        HttpResponse.json({ _id: "seller1", username: "janedoe", cardVerified: true })
      )
    );

    renderWithProviders(<GigCard item={baseItem} />);

    await waitFor(() => expect(screen.getByText("janedoe")).toBeInTheDocument());
    expect(screen.getByText("Deep house cleaning")).toBeInTheDocument();
  });

  it("shows an error state when the seller lookup fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    server.use(http.get(apiUrl("/users/:id"), () => HttpResponse.json({}, { status: 500 })));

    renderWithProviders(<GigCard item={baseItem} />);

    await waitFor(() => expect(screen.getByText("Something went wrong!")).toBeInTheDocument());
  });

  it("shows 'negotiable' instead of a price when the gig has no fixed price", async () => {
    server.use(
      http.get(apiUrl("/users/:id"), () => HttpResponse.json({ _id: "seller1", username: "janedoe" }))
    );

    renderWithProviders(<GigCard item={{ ...baseItem, isPriceNegotiable: true, price: undefined }} />);

    expect(screen.getByText("gig-card.priceNegotiable")).toBeInTheDocument();
  });

  it("warns a guest instead of navigating when clicked", async () => {
    server.use(
      http.get(apiUrl("/users/:id"), () => HttpResponse.json({ _id: "seller1", username: "janedoe" }))
    );
    const { user } = renderWithProviders(<GigCard item={baseItem} />);
    await waitFor(() => expect(screen.getByText("janedoe")).toBeInTheDocument());

    await user.click(screen.getByText("Deep house cleaning"));

    expect(
      screen.getByText("Ви не зареєстровані для перегляду цього оголошення.")
    ).toBeInTheDocument();
  });
});
