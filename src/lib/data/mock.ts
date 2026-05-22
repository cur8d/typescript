export interface KpiData {
  id: string;
  title: string;
  value: string | number;
  description: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
}

export interface TableItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  lastActive: string;
}

export const MOCK_KPIS: KpiData[] = [
  {
    id: "1",
    title: "Total Revenue",
    value: "$45,231.89",
    description: "from last month",
    trend: "up",
    trendValue: "+20.1%",
  },
  {
    id: "2",
    title: "Subscriptions",
    value: "+2350",
    description: "from last month",
    trend: "up",
    trendValue: "+180.1%",
  },
  {
    id: "3",
    title: "Sales",
    value: "+12,234",
    description: "from last month",
    trend: "up",
    trendValue: "+19%",
  },
  {
    id: "4",
    title: "Active Now",
    value: "+573",
    description: "since last hour",
    trend: "neutral",
    trendValue: "+201",
  },
];

export const MOCK_TABLE_DATA: TableItem[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
    lastActive: "2024-03-20",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "active",
    lastActive: "2024-03-19",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Editor",
    status: "inactive",
    lastActive: "2024-03-15",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "User",
    status: "pending",
    lastActive: "2024-03-21",
  },
  {
    id: "5",
    name: "Charlie Wilson",
    email: "charlie@example.com",
    role: "User",
    status: "active",
    lastActive: "2024-03-20",
  },
  {
    id: "6",
    name: "Diana Prince",
    email: "diana@example.com",
    role: "Admin",
    status: "active",
    lastActive: "2024-03-18",
  },
  {
    id: "7",
    name: "Ethan Hunt",
    email: "ethan@example.com",
    role: "User",
    status: "inactive",
    lastActive: "2024-03-10",
  },
  {
    id: "8",
    name: "Fiona Gallagher",
    email: "fiona@example.com",
    role: "Editor",
    status: "active",
    lastActive: "2024-03-21",
  },
  {
    id: "9",
    name: "George Costanza",
    email: "george@example.com",
    role: "User",
    status: "pending",
    lastActive: "2024-03-22",
  },
  {
    id: "10",
    name: "Hannah Abbott",
    email: "hannah@example.com",
    role: "User",
    status: "active",
    lastActive: "2024-03-19",
  },
  {
    id: "11",
    name: "Ian Wright",
    email: "ian@example.com",
    role: "Admin",
    status: "active",
    lastActive: "2024-03-20",
  },
];
