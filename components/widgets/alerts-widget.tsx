import { TrendingUp } from "lucide-react"

interface AlertsWidgetProps {
  data: any
  title?: string
}

export default function AlertsWidget({ data, title = "Workload Alerts" }: AlertsWidgetProps) {
  return (
    <div className="p-4 h-full flex flex-col">
      <h3 className="font-medium mb-4">{title}</h3>
      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2 hover:text-gray-500 transition-colors">
        <TrendingUp className="h-12 w-12 text-gray-300 hover:text-gray-400 transition-colors" />
        <p>No Graph data available!</p>
      </div>
    </div>
  )
}
