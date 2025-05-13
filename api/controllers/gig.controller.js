import Gig from "../models/gig.model.js";
import createError from "../utils/createError.js";
import User from "../models/user.model.js";
import Order from "../models/order.model.js";

export const createGig = async (req, res, next) => {
  if (!req.isSeller)
    return next(createError(403, "Only sellers can create a gig!"));

  if (!req.body.isPriceNegotiable && !req.body.price) 
    return next(createError(400, "Please provide a price or mark it as negotiable."));

  const visibility = req.body.languageVisibility;
  const visibleLanguages = Object.values(visibility).filter(Boolean);

  if (visibleLanguages.length !== 1) {
    return next(createError(400, "Please select exactly one language."));
  }


  const newGig = new Gig({
    userId: req.userId,
    ...req.body,
  });

  try {
    const savedGig = await newGig.save();
    res.status(201).json(savedGig);
  } catch (err) {
    next(err);
  }
};
export const deleteGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (gig.userId !== req.userId)
      return next(createError(403, "You can delete only your gig!"));

    await Gig.findByIdAndDelete(req.params.id);
    res.status(200).send("Gig has been deleted!");
  } catch (err) {
    next(err);
  }
};
export const getGig = async (req, res, next) => {
  try {
    const gig = await Gig.findById(req.params.id);
    if (!gig) next(createError(404, "Gig not found!"));
    res.status(200).send(gig);
  } catch (err) {
    next(err);
  }
};
export const getGigs = async (req, res, next) => {
  const q = req.query;
  const language = req.language || 'uk';
  const filters = {
    ...(q.userId && { userId: q.userId }),
    ...(q.cat && { cat: q.cat }),
    ...((q.min || q.max) && {
      price: {
        ...(q.min && { $gt: q.min }),
        ...(q.max && { $lt: q.max }),
      },
    }),
    ...(q.search && { title: { $regex: q.search, $options: "i" } }),
    ...(q.language && { [`languageVisibility.${q.language}`]: true })
  };

  try {
    const order = q.order === "asc" ? 1 : -1;
    const gigs = await Gig.find(filters).sort({ [q.sort]: order });

    const gigsWithDetails = await Promise.all(
      gigs.map(async (gig) => {
        const user = await User.findById(gig.userId).select("username location img");
        const orders = await Order.find({ gigId: gig._id });
    
        const clients = await Promise.all(
          orders.map(async (order) => {
            const clientUser = await User.findById(order.clientId).select("username img");
            return clientUser
              ? { 
                  username: clientUser.username, 
                  img: clientUser.img,
                  status: order.isCompleted ? "Completed" : "In progress"
                }
              : { 
                  username: "Unknown", 
                  img: null, 
                  status: "Unknown" 
                };
          })
        );
    
        return {
          ...gig._doc,
          username: user ? user.username : "Unknown",
          userImg: user ? user.img : null,
          location: user ? user.location : "Unknown",
          clients: clients,
        };
      })
    );    

    res.status(200).json(gigsWithDetails);
  } catch (err) {
    next(err);
  }
};
