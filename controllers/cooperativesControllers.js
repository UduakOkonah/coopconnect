const Cooperative = require("../models/cooperative");
const { validationResult } = require("express-validator");

// ✅ Create cooperative
exports.create = async (req, res, next) => {
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

// ✅ Get all cooperatives
exports.getAll = async (req, res, next) => {
  try {
    const coops = await Cooperative.find().populate("members", "-password");
    res.status(200).json(coops);
  } catch (err) {
    next(err);
  }
};

// ✅ Get one cooperative
exports.getOne = async (req, res, next) => {
  try {
    const coop = await Cooperative.findById(req.params.id).populate(
      "members",
      "-password"
    );
    if (!coop)
      return res.status(404).json({ message: "Cooperative not found" });
    res.status(200).json(coop);
  } catch (err) {
    next(err);
  }
};

// ✅ Update cooperative
exports.update = async (req, res, next) => {
  try {
    const coop = await Cooperative.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!coop)
      return res.status(404).json({ message: "Cooperative not found" });
    res.status(200).json(coop);
  } catch (err) {
    next(err);
  }
};

// ✅ Delete cooperative
exports.remove = async (req, res, next) => {
  try {
    const coop = await Cooperative.findByIdAndDelete(req.params.id);
    if (!coop)
      return res.status(404).json({ message: "Cooperative not found" });
    res.status(200).json({ message: "Cooperative deleted" });
  } catch (err) {
    next(err);
  }
};
