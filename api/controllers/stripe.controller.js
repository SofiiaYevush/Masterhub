import Stripe from "stripe";
import User from "../models/user.model.js";
import createError from "../utils/createError.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createSetupIntent = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return next(createError(404, "User not found!"));
    }

    if (user.cardVerified) {
      return next(createError(400, "Identity is already verified!"));
    }

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.username,
        metadata: {
          userId: user._id.toString(),
        },
      });

      stripeCustomerId = customer.id;

      user.stripeCustomerId = stripeCustomerId;
      await user.save();
    }

    const setupIntent = await stripe.setupIntents.create({
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      usage: "off_session",
      metadata: {
        userId: user._id.toString(),
      },
    });

    res.status(200).json({
      clientSecret: setupIntent.client_secret,
    });
  } catch (err) {
    next(err);
  }
};

export const handleStripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error.message
    );

    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case "setup_intent.succeeded": {
        const setupIntent = event.data.object;

        const userId = setupIntent.metadata?.userId;

        if (!userId) {
          console.error(
            "Stripe SetupIntent does not contain userId metadata."
          );
          break;
        }

        await User.findByIdAndUpdate(userId, {
          $set: {
            cardVerified: true,
          },
        });

        console.log(`Card verified for user ${userId}`);

        break;
      }

      default:
        break;
    }

    res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.error("Stripe webhook processing error:", error);

    res.status(500).json({
      error: "Webhook processing failed",
    });
  }
};