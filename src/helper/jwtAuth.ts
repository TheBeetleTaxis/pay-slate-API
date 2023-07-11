import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

export const generateAuthToken = ({ id, email}: any) =>
  jwt.sign({ id, email}, process.env.JWT_SECRET ?? '', {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// Missing from the initial pay-slate-server
export const verifyAuthToken = (id: string) =>{

}
