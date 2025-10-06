const Cooperative = require('../models/cooperative');
const { validationResult } = require('express-validator');

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const coop = await Cooperative.create(req.body);
    res.status(201).json(coop);
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const coops = await Cooperative.find().populate('members', '-password');
    res.json(coops);
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const coop = await Cooperative.findById(req.params.id).populate('members', '-password');
    if (!coop) return res.status(404).json({ message: 'Cooperative not found' });
    res.json(coop);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const coop = await Cooperative.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coop) return res.status(404).json({ message: 'Cooperative not found' });
    res.json(coop);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const coop = await Cooperative.findByIdAndDelete(req.params.id);
    if (!coop) return res.status(404).json({ message: 'Cooperative not found' });
    res.json({ message: 'Cooperative deleted' });
  } catch (err) {
    next(err);
  }
};
