import Joi from "joi";

const userScheme = Joi.object ({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid("admin", "user").default("user"),
  is_active: Joi.boolean().default(true),
});

const validateUser = (req, res, next) => {
  const {error} = userScheme.validate(req.body);
  if(error) return res.status(400).json({
    status: 400,
    message: error.details[0].message
  })
  next();
};

// ✅ Validación para membresías (al actualizar)
const membershipSchema = Joi.object({
  start_date: Joi.date().iso().required(),
  end_date: Joi.date().iso().min(Joi.ref("start_date")).required(),
  is_active: Joi.boolean().required(),
});

export const validateMembership = (req, res, next) => {
  const { error } = membershipSchema.validate(req.body);
  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  next();
};

export default validateUser;
