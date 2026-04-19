const Customer = require('../models/Customer');

exports.getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status, plan, sort = '-createdAt' } = req.query;
    const query = {};
    if (search) query.$or = [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }, { company: new RegExp(search, 'i') }];
    if (status) query.status = status;
    if (plan) query.plan = plan;

    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ customers, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const total = await Customer.countDocuments();
    const active = await Customer.countDocuments({ status: 'active' });
    const churned = await Customer.countDocuments({ status: 'churned' });
    const trial = await Customer.countDocuments({ status: 'trial' });
    const byPlan = await Customer.aggregate([{ $group: { _id: '$plan', count: { $sum: 1 } } }]);
    res.json({ total, active, churned, trial, byPlan });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
