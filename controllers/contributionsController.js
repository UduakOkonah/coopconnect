const Contribution = require("../models/contribution");
const { validationResult } = require("express-validator");

// ✅ Get all contributions
exports.getAll = async (req, res, next) => {
  try {
    const contributions = await Contribution.find();
    res.status(200).json(contributions);
  } catch (err) {
    next(err);
  }
};

// ✅ Get single contribution by ID
exports.getOne = async (req, res, next) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    if (!contribution)
      return res.status(404).json({ error: "Contribution not found" });
    res.status(200).json(contribution);
  } catch (err) {
    next(err);
  }
};

// ✅ Create new contribution
exports.create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { memberId, cooperativeId, amount } = req.body;
    const newContribution = await Contribution.create({
      memberId,
      cooperativeId,
      amount,
    });
    res.status(201).json(newContribution);
  } catch (err) {
    next(err);
  }
};

// ✅ Update contribution by ID
exports.update = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const contribution = await Contribution.findByIdAndUpdate(
      req.params.id,
      { amount: req.body.amount },
      { new: true }
    );
    if (!contribution)
      return res.status(404).json({ error: "Contribution not found" });
    res.status(200).json(contribution);
  } catch (err) {
    next(err);
  }
};

// ✅ Delete contribution
exports.remove = async (req, res, next) => {
  try {
    const contribution = await Contribution.findByIdAndDelete(req.params.id);
    if (!contribution)
      return res.status(404).json({ error: "Contribution not found" });
    res.status(200).json({ message: "Contribution deleted" });
  } catch (err) {
    next(err);
  }
};
