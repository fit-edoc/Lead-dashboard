import type { Request, Response, NextFunction } from 'express';
import Lead from '../models/Lead';
import { CustomError } from '../utils/CustomError';

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all leads (with filtering, sorting, pagination)
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, source, search, sort, page } = req.query;

    const query: any = {};

    // Filtering
    if (status) {
      query.status = status;
    }
    if (source) {
      query.source = source;
    }

    // Search by Name or Email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Sorting
    let sortOption = {};
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    } else {
      sortOption = { createdAt: -1 }; // latest is default
    }

    // Pagination
    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = 10;
    const skip = (pageNum - 1) * limitNum;

    const leads = await Lead.find(query).sort(sortOption).skip(skip).limit(limitNum);
    const total = await Lead.countDocuments(query);

    res.status(200).json({
      success: true,
      count: leads.length,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return next(new CustomError(`Lead not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lead) {
      return next(new CustomError(`Lead not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
      success: true,
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return next(new CustomError(`Lead not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
