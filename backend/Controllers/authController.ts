import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import User, { UserRole } from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { CustomError } from '../utils/CustomError.js';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return next(new CustomError('Please provide name, email and password', 400));
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new CustomError('Email already in use', 400));
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role && Object.values(UserRole).includes(role) ? role : UserRole.SALES_USER,
    });

    const token = generateToken(user._id as string, user.role);

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new CustomError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
      return next(new CustomError('Invalid credentials', 401));
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return next(new CustomError('Invalid credentials', 401));
    }

    const token = generateToken(user._id as string, user.role);

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: any, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
