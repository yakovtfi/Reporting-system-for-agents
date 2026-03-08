import {randomUUID} from 'crypto';
import { readReports, writeReports } from './dataSrore.js';

const allowedCategories = ["intelligence", "logistics", "alert"];
const allowedUrgencies = ["low", "medium", "high"];

export const createReport = async (input) => {
  const reports = await readReports();
  const report = {
    id: randomUUID(),
    userId: input.userId,
    category: input.category,
    urgency: input.urgency,
    message: input.message,
    imagePath: input.imagePath,
    sourceType: input.sourceType,
    createdAt: new Date().toISOString(),
  };
  const updated = [...reports, report];
  await writeReports(updated);
  return report;
};

export const listReports = async () => readReports();

export const getReportById = async (id) => {
  const reports = await readReports();
  return reports.find((report) => report.id === id);
};