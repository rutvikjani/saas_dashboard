const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/analyticsController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.use(authenticate);
router.get('/overview', ctrl.getOverview);
router.get('/traffic', requireAdmin, ctrl.getTraffic);

module.exports = router;