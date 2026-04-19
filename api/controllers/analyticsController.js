const Customer = require('../models/Customer');
const Revenue = require('../models/Revenue');
const ActivityLog = require('../models/ActivityLog');

exports.getOverview = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Run all queries in parallel instead of one by one
    const [
      totalCustomers,
      activeCustomers,
      newThisMonth,
      revenueData,
      activities,
      monthlyGrowth,
    ] = await Promise.all([
      Customer.countDocuments(),
      Customer.countDocuments({ status: 'active' }),
      Customer.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Revenue.find().sort('month').limit(12).lean(),
      ActivityLog.find().sort('-createdAt').limit(10).populate('userId', 'name avatar').lean(),
      Customer.aggregate([
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 }
      ]),
    ]);

    const currentRevenue = revenueData[revenueData.length - 1] || { mrr: 0, arr: 0, churnRate: 0 };

    res.json({
      kpis: {
        totalCustomers,
        activeCustomers,
        newThisMonth,
        mrr: currentRevenue.mrr,
        arr: currentRevenue.arr,
        churnRate: currentRevenue.churnRate,
      },
      revenueChart: revenueData.map(r => ({ month: r.month, mrr: r.mrr, arr: r.arr })),
      userGrowth: monthlyGrowth,
      activities,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTraffic = async (req, res) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const traffic = months.map((month) => ({
    month,
    visits: Math.floor(10000 + Math.random() * 50000),
    uniqueVisitors: Math.floor(5000 + Math.random() * 30000),
    pageViews: Math.floor(20000 + Math.random() * 100000),
    bounceRate: (30 + Math.random() * 30).toFixed(1),
    conversionRate: (1 + Math.random() * 5).toFixed(2),
  }));

  const deviceSources = [
    { device: 'Desktop', percentage: 58, sessions: 48200 },
    { device: 'Mobile', percentage: 32, sessions: 26600 },
    { device: 'Tablet', percentage: 10, sessions: 8300 },
  ];

  const channelSources = [
    { channel: 'Organic Search', visits: 42000, percentage: 42 },
    { channel: 'Direct', visits: 28000, percentage: 28 },
    { channel: 'Social Media', visits: 18000, percentage: 18 },
    { channel: 'Referral', visits: 8000, percentage: 8 },
    { channel: 'Email', visits: 4000, percentage: 4 },
  ];

  res.json({ traffic, deviceSources, channelSources });
};