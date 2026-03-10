import { parse } from 'csv-parse/sync';
import { findUserByAgentCode, listUsers } from '../services/userService.js';
import * as reportService from '../services/reportService.js';

export const createReportHandler = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Missing user' });
    return;
  }
  const { category, urgency, message } = req.body || {};
  if (!category || !urgency || !message) {
    res.status(400).json({ message: 'category, urgency, and message are required' });
    return;
  }
  if (!reportService.allowedCategories.includes(category)) {
    res.status(400).json({ message: 'Invalid category' });
    return;
  }
  if (!reportService.allowedUrgencies.includes(urgency)) {
    res.status(400).json({ message: 'Invalid urgency' });
    return;
  }

  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  const report = await reportService.createReport({
    userId: req.user.id,
    category,
    urgency,
    message,
    imagePath,
    sourceType: 'form',
  });
  res.status(201).json({ report });
};

export const importCsvHandler = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Missing user' });
    return;
  }
  if (!req.file || !req.file.buffer) {
    res.status(400).json({ message: 'csvFile is required' });
    return;
  }

  const raw = req.file.buffer.toString('utf-8');
  let records;
  try {
    records = parse(raw, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
  } catch (_err) {
    res.status(400).json({ message: 'Invalid CSV format' });
    return;
  }

  const reports = [];
  for (const row of records) {
    if (!row.category || !row.urgency || !row.message) {
      res.status(400).json({ message: 'CSV missing required columns' });
      return;
    }
    if (!reportService.allowedCategories.includes(row.category)) {
      res.status(400).json({ message: 'Invalid category in CSV' });
      return;
    }
    if (!reportService.allowedUrgencies.includes(row.urgency)) {
      res.status(400).json({ message: 'Invalid urgency in CSV' });
      return;
    }

    const report = await reportService.createReport({
      userId: req.user.id,
      category: row.category,
      urgency: row.urgency,
      message: row.message,
      imagePath: null,
      sourceType: 'csv',
    });
    reports.push(report);
  }
  res.status(201).json({ importedCount: reports.length, reports });
};

export const listReportsHandler = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Missing user' });
    return;
  }

  const { agentCode, category, urgency } = req.query || {};

  const reports = await reportService.listReports();
  let filtered = reports;

  if (req.user.role !== "admin") {
    filtered = filtered.filter((report) => report.userId === req.user.id);
  } else if (agentCode) {
    const user = await findUserByAgentCode(agentCode);
    filtered = user ? filtered.filter((report) => report.userId === user.id) : [];
  }

  if (category) {
    filtered = filtered.filter((report) => report.category === category);
  }
  if (urgency) {
    filtered = filtered.filter((report) => report.urgency === urgency);
  }

  const users = await listUsers();
  const userMap = new Map(users.map((user) => [user.id, user.agentCode]));
  const enriched = filtered.map((report) => ({
    ...report,
    agentCode: userMap.get(report.userId) ?? null,
  }));

  res.json({ reports: enriched });
};

export const getReportHandler = async (req, res) => {
  if (!req.user) {
    res.status(401).json({ message: 'Missing user' });
    return;
  }
  const report = await reportService.getReportById(req.params.id);
  if (!report) {
    res.status(404).json({ message: "Report not found" });
    return;
  }
  if (req.user.role !== "admin" && report.userId !== req.user.id) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }
  res.json({ report });
};