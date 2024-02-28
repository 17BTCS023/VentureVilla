const joi = require("joi");

module.exports.listingSchema = joi.object( {
    listing : joi.object(
        {
            title: joi.string().required(),
            description: joi.string().required(),
            price: joi.number().required().min(0),
            image: joi.object({
                filename:joi.string().allow("",null).default("listingimage"),
                url: joi.string().allow("", null),
            }),
            location: joi.string().required(),
            country: joi.string().required(),
            reviews: joi.array().items({
                rating: joi.number().required(),
                comment: joi.string().required(),
            }).allow(null),
        }
    ).required()
    }
);

module.exports.reviewSchema = joi.object( {
    review : joi.object(
        {
            rating: joi.number().required().min(1).max(5),
            comment: joi.string().required(),
        }
    ).required()
    }
);