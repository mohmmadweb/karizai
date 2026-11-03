import { TrendChart } from "@/admin/components/shared/trend-chart";

const labels = ["۱", "۲", "۳", "۴", "۵", "۶", "۷"];

/** Neutral preview of the shared trend chart. */
export function TrendChartDemo() {
  return (
    <TrendChart
      labels={labels}
      unit="مورد"
      ariaLabel="نمونه‌ی نمودار روند"
      series={[
        { key: "a", label: "سری اول", values: [12, 18, 9, 22, 30, 14, 20], color: "chart-1" },
        { key: "b", label: "سری دوم", values: [6, 10, 4, 12, 15, 8, 9], color: "chart-2" },
      ]}
    />
  );
}
