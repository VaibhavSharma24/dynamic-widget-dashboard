interface ImageRiskData {
  total: number
  critical: number
  high: number
  medium?: number
  low?: number
}

interface ImageRiskWidgetProps {
  data: ImageRiskData
}

export default function ImageRiskWidget({ data }: ImageRiskWidgetProps) {
  const maxValue = Math.max(data.critical, data.high, data.medium || 0, data.low || 0)

  const getWidth = (value: number) => {
    return `${(value / maxValue) * 100}%`
  }

  return (
    <div className="p-4 h-full">
      <h3 className="font-medium mb-2">Image Risk Assessment</h3>
      <div className="flex items-center gap-2">
        <div className="text-2xl font-bold">{data.total}</div>
        <div className="text-sm text-gray-500">Total Vulnerabilities</div>
      </div>

      <div className="mt-4 space-y-3">
        <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
          <div className="flex rounded-full h-2.5 overflow-hidden">
            <div className="bg-red-600" style={{ width: getWidth(data.critical) }}></div>
            <div className="bg-orange-500" style={{ width: getWidth(data.high) }}></div>
            {data.medium && <div className="bg-yellow-400" style={{ width: getWidth(data.medium) }}></div>}
            {data.low && <div className="bg-green-500" style={{ width: getWidth(data.low) }}></div>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded transition-colors">
            <div className="w-3 h-3 rounded-sm bg-red-600"></div>
            <span className="text-sm">Critical ({data.critical})</span>
          </div>
          <div className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded transition-colors">
            <div className="w-3 h-3 rounded-sm bg-orange-500"></div>
            <span className="text-sm">High ({data.high})</span>
          </div>
          {data.medium && (
            <div className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded transition-colors">
              <div className="w-3 h-3 rounded-sm bg-yellow-400"></div>
              <span className="text-sm">Medium ({data.medium})</span>
            </div>
          )}
          {data.low && (
            <div className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded transition-colors">
              <div className="w-3 h-3 rounded-sm bg-green-500"></div>
              <span className="text-sm">Low ({data.low})</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
