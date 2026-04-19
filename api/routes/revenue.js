const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/revenueController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate);
router.use(requireAdmin);
router.get('/', ctrl.getRevenue);
router.get('/summary', ctrl.getSummary);

module.exports = router;