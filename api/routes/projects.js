const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/projectController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/', ctrl.getProjects);
router.post('/', ctrl.createProject);
router.put('/:id', ctrl.updateProject);
router.delete('/:id', ctrl.deleteProject);
router.post('/:id/tasks', ctrl.addTask);
router.put('/:id/tasks/:taskId', ctrl.updateTask);

module.exports = router;
