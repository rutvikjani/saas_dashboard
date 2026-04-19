require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Customer = require('../models/Customer');
const Revenue = require('../models/Revenue');
const Project = require('../models/Project');
const ActivityLog = require('../models/ActivityLog');

const connectDB = require('./db');

const plans = ['free', 'starter', 'pro', 'enterprise'];
const statuses = ['active', 'inactive', 'churned', 'trial'];
const countries = ['United States', 'United Kingdom', 'Germany', 'France', 'Canada', 'Australia', 'Japan', 'Brazil'];

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seed() {
  await connectDB();
  await Promise.all([User.deleteMany(), Customer.deleteMany(), Revenue.deleteMany(), Project.deleteMany(), ActivityLog.deleteMany()]);
  console.log('🗑️  Cleared existing data');

  // Create users
  const adminUser = await User.create({
    name: 'Alex Morgan',
    email: 'admin@demo.com',
    password: 'password123',
    role: 'admin',
    company: 'NovaSaaS Inc.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  });

  await User.create({
    name: 'Sam Rivera',
    email: 'staff@demo.com',
    password: 'password123',
    role: 'staff',
    company: 'NovaSaaS Inc.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
  });
  console.log('👥 Created users');

  // Create customers
  const firstNames = ['James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'Oliver', 'Isabella', 'Benjamin', 'Mia', 'Elijah', 'Charlotte', 'Lucas', 'Amelia', 'Mason', 'Harper', 'Logan', 'Evelyn'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Wilson', 'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson', 'Robinson', 'Clark', 'Lewis'];
  const companies = ['Acme Corp', 'TechFlow', 'DataDriven', 'CloudSync', 'InnovateLab', 'ScaleUp', 'Nexus Systems', 'PivotPoint', 'VentureStack', 'Orbit Media'];

  const customers = [];
  for (let i = 0; i < 50; i++) {
    const firstName = randomItem(firstNames);
    const lastName = randomItem(lastNames);
    const plan = randomItem(plans);
    const mrrMap = { free: 0, starter: 29, pro: 99, enterprise: 499 };
    const daysAgo = randomInt(1, 365);
    const joinDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    customers.push({
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`,
      company: randomItem(companies),
      phone: `+1 (${randomInt(200, 999)}) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
      status: randomItem(statuses),
      plan,
      mrr: mrrMap[plan],
      country: randomItem(countries),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${i}`,
      joinedAt: joinDate,
      lastActivity: new Date(Date.now() - randomInt(0, 30) * 24 * 60 * 60 * 1000),
    });
  }
  await Customer.insertMany(customers);
  console.log('👤 Created 50 customers');

  // Create revenue data (12 months)
  const revenueData = [];
  let baseMrr = 8000;
  for (let i = 11; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const growth = 1 + (Math.random() * 0.15 + 0.03);
    baseMrr = Math.floor(baseMrr * growth);
    const churnedRevenue = Math.floor(baseMrr * 0.02);
    const newRevenue = Math.floor(baseMrr * 0.12);
    revenueData.push({
      month,
      mrr: baseMrr,
      arr: baseMrr * 12,
      newRevenue,
      churnedRevenue,
      expansionRevenue: Math.floor(baseMrr * 0.04),
      activeSubscriptions: randomInt(80, 200),
      churnRate: parseFloat((2 + Math.random() * 3).toFixed(2)),
    });
  }
  await Revenue.insertMany(revenueData);
  console.log('💰 Created revenue data');

  // Create projects
  const projectData = [
    {
      name: 'Website Redesign',
      description: 'Complete overhaul of the marketing website with new brand identity',
      status: 'active',
      progress: 65,
      color: '#6366f1',
      team: ['Alex Morgan', 'Sam Rivera', 'Jordan Lee'],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      tasks: [
        { title: 'Design mockups', status: 'done', priority: 'high', assignee: 'Alex Morgan' },
        { title: 'Frontend development', status: 'in_progress', priority: 'high', assignee: 'Sam Rivera' },
        { title: 'Content migration', status: 'todo', priority: 'medium', assignee: 'Jordan Lee' },
        { title: 'SEO optimization', status: 'todo', priority: 'low', assignee: 'Alex Morgan' },
        { title: 'QA testing', status: 'todo', priority: 'high', assignee: 'Sam Rivera' },
      ],
    },
    {
      name: 'Mobile App v2.0',
      description: 'Major feature release including offline mode and push notifications',
      status: 'active',
      progress: 40,
      color: '#f59e0b',
      team: ['Sam Rivera', 'Chris Park'],
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      tasks: [
        { title: 'Architecture planning', status: 'done', priority: 'urgent', assignee: 'Chris Park' },
        { title: 'Offline sync engine', status: 'in_progress', priority: 'urgent', assignee: 'Sam Rivera' },
        { title: 'Push notification system', status: 'in_progress', priority: 'high', assignee: 'Chris Park' },
        { title: 'UI redesign', status: 'review', priority: 'medium', assignee: 'Sam Rivera' },
        { title: 'Beta testing', status: 'todo', priority: 'high', assignee: 'Chris Park' },
        { title: 'App store submission', status: 'todo', priority: 'medium', assignee: 'Sam Rivera' },
      ],
    },
    {
      name: 'API v3 Migration',
      description: 'Migrate all endpoints to new REST API with improved performance',
      status: 'active',
      progress: 80,
      color: '#10b981',
      team: ['Jordan Lee', 'Alex Morgan'],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      tasks: [
        { title: 'Endpoint mapping', status: 'done', priority: 'high', assignee: 'Jordan Lee' },
        { title: 'New route implementation', status: 'done', priority: 'high', assignee: 'Alex Morgan' },
        { title: 'Deprecation notices', status: 'done', priority: 'medium', assignee: 'Jordan Lee' },
        { title: 'Load testing', status: 'in_progress', priority: 'high', assignee: 'Alex Morgan' },
        { title: 'Documentation update', status: 'review', priority: 'medium', assignee: 'Jordan Lee' },
      ],
    },
    {
      name: 'Analytics Dashboard',
      description: 'Build comprehensive analytics with real-time data visualization',
      status: 'paused',
      progress: 25,
      color: '#ec4899',
      team: ['Alex Morgan'],
      dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      tasks: [
        { title: 'Data model design', status: 'done', priority: 'high', assignee: 'Alex Morgan' },
        { title: 'Chart components', status: 'in_progress', priority: 'medium', assignee: 'Alex Morgan' },
        { title: 'Real-time pipeline', status: 'todo', priority: 'high', assignee: 'Alex Morgan' },
        { title: 'Export functionality', status: 'todo', priority: 'low', assignee: 'Alex Morgan' },
      ],
    },
  ];
  await Project.insertMany(projectData);
  console.log('📋 Created projects');

  // Activity logs
  const actions = [
    { action: 'customer.created', description: 'New customer signed up', entity: 'Customer' },
    { action: 'customer.upgraded', description: 'Customer upgraded plan', entity: 'Customer' },
    { action: 'project.updated', description: 'Project progress updated', entity: 'Project' },
    { action: 'invoice.paid', description: 'Invoice payment received', entity: 'Revenue' },
    { action: 'user.login', description: 'Admin logged in', entity: 'User' },
  ];
  const logs = Array.from({ length: 20 }, (_, i) => ({
    userId: adminUser._id,
    ...randomItem(actions),
    createdAt: new Date(Date.now() - randomInt(0, 7) * 24 * 60 * 60 * 1000 - randomInt(0, 23) * 60 * 60 * 1000),
  }));
  await ActivityLog.insertMany(logs);
  console.log('📝 Created activity logs');

  try {
  await Customer.collection.createIndex({ status: 1 }, { background: true });
  await Customer.collection.createIndex({ createdAt: -1 }, { background: true });
  await Revenue.collection.createIndex({ month: 1 }, { background: true });
  await ActivityLog.collection.createIndex({ createdAt: -1 }, { background: true });
  console.log('✅ Indexes created');
} catch (e) {
  console.log('Indexes already exist');
}
}

seed().catch(err => { console.error(err); process.exit(1); });
