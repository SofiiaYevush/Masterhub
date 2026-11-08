// Loaded via vitest's `setupFiles`, before any test file (and therefore before
// app.js) is imported. Several controllers read process.env at import time
// (e.g. stripe.controller.js constructs `new Stripe(...)` eagerly), so these
// fake values must exist before anything requires them. Never real secrets.
process.env.NODE_ENV = "test";
process.env.JWT_KEY = "test-jwt-signing-secret";
process.env.ADMIN_USERNAME = "test-admin";
process.env.ADMIN_PASSWORD = "test-admin-password";
process.env.STRIPE_SECRET_KEY = "sk_test_fake_key_for_unit_tests";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_fake_test_secret";
process.env.CLIENT_URL = "http://localhost:5173";
