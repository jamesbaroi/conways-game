import dotenv from "dotenv";

dotenv.config();

// App-env
export const nodenv = process.env.NODE_ENV;
export const host = process.env.HOST;
export const port = process.env.PORT;