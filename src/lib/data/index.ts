import { MOCK_KPIS, MOCK_TABLE_DATA, type KpiData, type TableItem } from "./mock";

/**
 * Simulates a delay for async data fetching
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getKpis(): Promise<KpiData[]> {
  // In a real app, this would fetch from an API or database
  await delay(500);
  return MOCK_KPIS;
}

export async function getTableData(): Promise<TableItem[]> {
  // In a real app, this would fetch from an API or database
  await delay(800);
  return MOCK_TABLE_DATA;
}
