import Joi from "joi";

export const addToExampleSchema = Joi.object({
	name: Joi.string().required().trim().messages({
		"string.empty": "Please select a singer name.",
		"any.required": "Please select a singer name.",
	}),
	example: Joi.string().required().trim().min(3).messages({
		"string.empty": "Music is required.",
		"string.min": "Music must be at least 3 characters long.",
		"any.required": "Music is required.",
	}),
});

export const deleteFromExampleSchema = Joi.object({
	name: Joi.string().required().trim().messages({
		"string.empty": "Please select a singer name.",
		"any.required": "Please select a singer name.",
	}),
	example: Joi.string().required().trim().messages({
		"string.empty": "Please select a music.",
		"any.required": "Please select a music.",
	}),
});