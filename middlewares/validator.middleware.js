import Joi from "joi";

export const validateSignup = (req, res, next) => {
    const { error } = signupSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ error: error.details.map((err) => err.message) });
    next()
}
export const validateStay = (req, res, next) => {
    // console.log(req.body);
    const { error } = staySchema.validate(req.body, { abortEarly: false });
    if (error) {
        // console.log(error);
        return res.status(400).json({ error: error.details.map((err) => err.message) });
    }
    next()
}
export const validateOrder = (req, res, next) => {
    const { error } = orderSchema.validate(req.body, { abortEarly: false });
    if (error){
        console.log(error);
        return res.status(400).json({ error: error.details.map((err) => err.message) });
    } 
    next()
}
// const signupSchema = Joi.object({
//   email: Joi.string().email().required(),
//   password: Joi.string().min(3).max(10).required(),
//   confirmPassword: Joi.ref("password"),
//   address: {
//     state: Joi.string().length(2).required(),
//   },
//   DOB: Joi.date().greater(new Date("2012-01-01")).required(),
//   referred: Joi.boolean().required(),
//   referralDetails: Joi.string().when("referred", {
//     is: true,
//     then: Joi.string().required().min(3).max(50),
//     otherwise: Joi.string().optional(),
//   }),
//   hobbies: Joi.array().items([Joi.string(), Joi.number()]),
//   acceptTos: Joi.boolean().truthy("Yes").valid(true).required(),
// });validator

const signupSchema = Joi.object({
    userName: Joi.string().min(1).max(20).required(),
    password: Joi.string().min(1).required(),
    fullName: Joi.string().min(1).max(30).required(),
    imgUrl: Joi.string().allow(null).min(0).max(190)
});

const staySchema = Joi.object({
    _id: Joi.string().min(2),
    name: Joi.string().min(0).max(50),
    type: Joi.string().min(0).max(20),
    imgUrls: Joi.array().items(Joi.string()),
    price: Joi.number().min(1),
    summary: Joi.string().min(2).max(500),
    capacity: Joi.object({
        guests: Joi.number().min(1),
        bedrooms: Joi.number().min(0),
        beds: Joi.number().min(0),
        bathrooms: Joi.number().min(0)
    }),
    amenities: Joi.array().items(Joi.string()),
    labels: Joi.array().items(Joi.string()),
    host: Joi.object({
        _id: Joi.string().min(2).required(),
        fullName: Joi.string().min(2).max(20).required(),
        imgUrl: Joi.string().min(10).max(190).optional().allow(null),
    }),
    loc: Joi.object({
        country: Joi.string().min(2).required(),
        countryCode: Joi.string().min(0).required(),
        city: Joi.string().min(2).required(),
        street: Joi.string().min(2).required(),
        houseNumber: Joi.string().min(0),
        lat: Joi.number(),
        lng: Joi.number()
    }),
    reviews: Joi.array().items(Joi.object()).optional().default([]),
    likedByUsers: Joi.array().items(Joi.object()).optional().default([]),
    DateNotAvailable: Joi.array().items(Joi.string()).optional().default([]),
});

const orderSchema = Joi.object({
    _id: Joi.string().min(2),
    hostId: Joi.string().min(2).required(),
    host: Joi.object({
        _id: Joi.string().min(2).required(),
        fullName: Joi.string().min(2).max(20).required(),
        imgUrl: Joi.string().min(10).max(190).optional().allow(null),
    }),
    buyer: Joi.object({
        _id: Joi.string().min(2).required(),
        fullName: Joi.string().min(2).max(20).required(),
        imgUrl: Joi.string().min(10).max(190).optional().allow(null),
    }),
    totalPrice: Joi.number().min(1).optional().allow(null),
    checkIn: Joi.string().min(5).max(190).optional().allow(null),
    checkOut: Joi.string().min(5).max(190).optional().allow(null),
    guests: Joi.object({
        adults: Joi.number().min(0),
        children: Joi.number().min(0),
        infants: Joi.number().min(0),
    }),
    stay: Joi.object({
        _id: Joi.string().min(2).required(),
        name: Joi.string().min(2).required(),
        price: Joi.number().min(1).required(),
        imgUrl: Joi.string().min(10).max(190).optional().allow(null),
    }),
    msgs: Joi.array().items(Joi.object()).optional().default([]),
    status: Joi.string().required(),
    lastUpdate: Joi.number().required(),
});
