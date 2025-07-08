import user from '../models/user.model.js';
import bcrypt from 'bcrypt';

export const registerUserService = async ({ name, email, password }) => {
  const existingUser = await user.findOne({ email });
  if (existingUser) {
    throw new Error('User already registered. Please login.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new user({
    name,
    email,
    password: hashedPassword,
  });

  const savedUser = await newUser.save();

  return {
    id: savedUser._id,
    name: savedUser.name,
    email: savedUser.email,
  };
};


