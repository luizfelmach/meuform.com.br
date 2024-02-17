import * as yup from "yup";

const envSchema = yup.object({
  DATABASE_URL: yup.string().required(),

  JWT_SECRET: yup.string().required(),

  APP_URL: yup.string().required(),

  MAILER_HOST: yup.string().required(),
  MAILER_FROM: yup.string().required(),
  MAILER_PORT: yup.string().required(),
  MAILER_USER: yup.string().required(),
  MAILER_PASS: yup.string().required(),

  STRIPE_PRIVATE_KEY: yup.string().required(),
  STRIPE_PUBLIC_KEY: yup.string().required(),

  STRIPE_PRICE_MONTHLY: yup.string().required(),
  STRIPE_PRICE_YEARLY: yup.string().required(),
});

export const env = envSchema.validateSync(process.env, { stripUnknown: true });
