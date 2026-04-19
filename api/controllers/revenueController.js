const Revenue = require('../models/Revenue');

exports.getRevenue = async (req, res) => {
  try {
    const data = await Revenue.find().sort('month');
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSummary = async (req, res) => {
  try {
    const data = await Revenue.find().sort('month');
    const latest = data[data.length - 1] || {};
    const prev = data[data.length - 2] || {};

    const mrrGrowth = prev.mrr ? (((latest.mrr - prev.mrr) / prev.mrr) * 100).toFixed(1) : 0;

    res.json({
      mrr: latest.mrr || 0,
      arr: latest.arr || 0,
      churnRate: latest.churnRate || 0,
      activeSubscriptions: latest.activeSubscriptions || 0,
      mrrGrowth,
      monthlyData: data.map(d => ({
        month: d.month,
        mrr: d.mrr,
        newRevenue: d.newRevenue,
        churnedRevenue: d.churnedRevenue,
        expansionRevenue: d.expansionRevenue,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
