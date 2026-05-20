import express from 'express';
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead,
} from '../Controllers/leadController';
import { protect, authorize } from '../middleware/authMiddleware';
import { UserRole } from '../models/User';

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

router
  .route('/')
  .get(getLeads)
  .post(createLead);

router
  .route('/:id')
  .get(getLead)
  .put(updateLead)
  .delete(authorize(UserRole.ADMIN), deleteLead); // Only admin can delete

export default router;
