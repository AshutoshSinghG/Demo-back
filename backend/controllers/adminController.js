import { User } from '../models/User.js';
import { Service } from '../models/Service.js';
import { success } from '../utils/response.js';

export const listUsers = async (req, res, next) => {
  try {
    const { q, role, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (q) filter.$text = { $search: q };
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      User.find(filter).skip(skip).limit(Number(limit)).lean(),
      User.countDocuments(filter),
    ]);
    return success(res, { items, total, page: Number(page), limit: Number(limit) }, 'Users');
  } catch (err) {
    next(err);
  }
};

export const deactivateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
    if (!user) return res.status(404).json({ ok: false, message: 'User not found' });
    return success(res, user, 'User deactivated');
  } catch (err) {
    next(err);
  }
};

export const listServicesAdmin = async (req, res, next) => {
  try {
    const { q, category, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) filter.$text = { $search: q };
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Service.find(filter).skip(skip).limit(Number(limit)).lean(),
      Service.countDocuments(filter),
    ]);
    return success(res, { items, total, page: Number(page), limit: Number(limit) }, 'Services');
  } catch (err) {
    next(err);
  }
};

export const deactivateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const svc = await Service.findByIdAndUpdate(id, { isActive: false }, { new: true }).lean();
    if (!svc) return res.status(404).json({ ok: false, message: 'Service not found' });
    return success(res, svc, 'Service deactivated');
  } catch (err) {
    next(err);
  }
};

export const metrics = async (req, res, next) => {
  try {
    const [usersCount, servicesCount, topArtists] = await Promise.all([
      User.countDocuments({}),
      Service.countDocuments({}),
      User.find({ role: 'artist' }).sort({ avgRating: -1, reviewsCount: -1 }).limit(5).lean(),
    ]);
    return success(res, { usersCount, servicesCount, topArtists }, 'Metrics');
  } catch (err) {
    next(err);
  }
};



