import { describe, it, expect } from "vitest";
import { getKpis, getTableData } from "../index";
import { MOCK_KPIS, MOCK_TABLE_DATA } from "../mock";

describe("Data Layer", () => {
  it("fetches KPI data", async () => {
    const kpis = await getKpis();
    expect(kpis).toEqual(MOCK_KPIS);
  });

  it("fetches table data", async () => {
    const data = await getTableData();
    expect(data).toEqual(MOCK_TABLE_DATA);
  });
});
