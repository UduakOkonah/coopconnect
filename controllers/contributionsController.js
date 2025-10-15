const Contribution = require('../models/contribution');
const { validationResult } = require('express-validator');

exports.getAllContributions = async (req, res) => {
  try {
    const contributions = await Contribution.find();
    res.status(200).json(contributions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getContributionById = async (req, res) => {
  try {
    const contribution = await Contribution.findById(req.params.id);
    if (!contribution) return res.status(404).json({ error: 'Contribution not found' });
    res.status(200).json(contribution);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createContribution = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { memberId, cooperativeId, amount } = req.body;

  try {
    const newContribution = await Contribution.create({ memberId, cooperativeId, amount });
    res.status(201).json(newContribution);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateContribution = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { amount } = req.body;

  try {
    const contribution = await Contribution.findByIdAndUpdate(
      req.params.id,
      { amount },
      { new: true }
    );
    if (!contribution) return res.status(404).json({ error: 'Contribution not found' });
    res.status(200).json(contribution);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteContribution = async (req, res) => {
  try {
    const contribution = await Contribution.findByIdAndDelete(req.params.id);
    if (!contribution) return res.status(404).json({ error: 'Contribution not found' });
    res.status(200).json({ message: 'Contribution deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};