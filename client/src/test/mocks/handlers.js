import { http, HttpResponse } from "msw";

// Built from the real VITE_API_URL (not a bare path) - MSW's node
// interceptor resolves relative handler paths against a default origin that
// doesn't necessarily match the configured API host/port, so an absolute
// URL here is what reliably intercepts requests from newRequest's axios
// instance. Individual tests override a handler with `server.use(...)` for
// failure/edge-case scenarios.
// Exported so individual tests can build `server.use(...)` overrides against
// the same absolute origin (e.g. apiUrl("/users/u1")).
export const apiUrl = (path) => `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}${path}`;
const base = import.meta.env.VITE_API_URL.replace(/\/$/, "");

export const handlers = [
  http.post(`${base}/auth/login`, () =>
    HttpResponse.json({
      _id: "u1",
      username: "demo-user",
      isAdmin: false,
      isSeller: false,
    })
  ),

  http.post(`${base}/auth/logout`, () => HttpResponse.text("User has been logged out.")),

  http.get(`${base}/users/:id`, ({ params }) =>
    HttpResponse.json({
      _id: params.id,
      username: "demo-user",
      img: null,
      cardVerified: false,
    })
  ),

  http.get(`${base}/gigs`, () => HttpResponse.json([])),
];
