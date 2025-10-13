const Cooperative = require('../models/cooperative');
const { validationResult } = require('express-validator');

// @desc    Create a new cooperative
// @route   POST /api/cooperatives
exports.createCooperative = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const coop = await Cooperative.create(req.body);
    res.status(201).json(coop);
  } catch (err) {
    next(err);
  }
};

// @desc    Get all cooperatives
// @route   GET /api/cooperatives
exports.getAllCooperatives = async (req, res, next) => {
  try {
    const coops = await Cooperative.find()
      .populate('members', 'name email')
      .populate('admins', 'name email');
    res.json(coops);
  } catch (err) {
    next(err);
  }
};

// @desc    Get a cooperative by ID
// @route   GET /api/cooperatives/:id
exports.getCooperativeById = async (req, res, next) => {
  try {
    const coop = await Cooperative.findById(req.params.id)
      .populate('members', 'name email')
      .populate('admins', 'name email');
    if (!coop)
      return res.status(404).json({ message: 'Cooperative not found' });
    res.json(coop);
  } catch (err) {
    next(err);
  }
};

// @desc    Update cooperative
// @route   PUT /api/cooperatives/:id
exports.updateCooperative = async (req, res, next) => {
  try {
    const coop = await Cooperative.findById(req.params.id);
    if (!coop)
      return res.status(404).json({ message: 'Cooperative not found' });

    // Allow updates for only specific fields
    const allowed = ['name', 'description', 'location', 'category', 'members', 'admins'];
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) {
        coop[key] = req.body[key];
      }
    });

    await coop.save();
    const updated = await Cooperative.findById(coop._id)
      .populate('members', 'name email')
      .populate('admins', 'name email');

    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// @desc    Delete cooperative
// @route   DELETE /api/cooperatives/:id
exports.deleteCooperative = async (req, res, next) => {
  try {
    const coop = await Cooperative.findByIdAndDelete(req.params.id);
    if (!coop)
      return res.status(404).json({ message: 'Cooperative not found' });
    res.json({ message: 'Cooperative deleted successfully' });
  } catch (err) {
    next(err);
  }
};
