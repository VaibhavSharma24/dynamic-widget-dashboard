import { DonutChart } from "@/components/ui/donut-chart"

interface RiskAssessmentData {
  total: number
  failed: number
  warning: number
  notAvailable: number
  passed: number
}

interface RiskAssessmentWidgetProps {
  data: RiskAssessmentData
}

export default function RiskAssessmentWidget({ data }: RiskAssessmentWidgetProps) {
  const chartData = [
    { name: "Failed", value: data.failed, color: "#DC2626" },
    { name: "Warning", value: data.warning, color: "#F59E0B" },
    { name: "Not available", value: data.notAvailable, color: "#E5E7EB" },
    { name: "Passed", value: data.passed, color: "#10B981" },
  ]

  return (
    <div className="p-4 h-full">
      <h3 className="font-medium mb-4">Cloud Account Risk Assessment</h3>
      <div className="flex items-center justify-center">
        <DonutChart data={chartData} total={data.total} width={180} height={180} />
      </div>
      <div className="mt-4 space-y-2">
        {chartData.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-2 hover:bg-indigo-50 p-1 rounded transition-colors cursor-pointer"
          >
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></div>
            <span className="text-sm">
              {item.name} ({item.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
