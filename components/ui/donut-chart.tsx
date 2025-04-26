"use client"

import { useEffect, useRef } from "react"

interface ChartData {
  name: string
  value: number
  color: string
}

interface DonutChartProps {
  data: ChartData[]
  total: number
  width?: number
  height?: number
}

export function DonutChart({ data, total, width = 200, height = 200 }: DonutChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate total value
    const totalValue = data.reduce((sum, item) => sum + item.value, 0)

    // Draw donut chart
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) * 0.8
    const innerRadius = radius * 0.6

    let startAngle = -Math.PI / 2

    data.forEach((item) => {
      const sliceAngle = (2 * Math.PI * item.value) / totalValue

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle)
      ctx.closePath()
      ctx.fillStyle = item.color
      ctx.fill()

      // Draw inner circle to create donut
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI)
      ctx.fillStyle = "white"
      ctx.fill()

      startAngle += sliceAngle
    })

    // Draw total in center
    ctx.fillStyle = "#333"
    ctx.font = "bold 24px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(total.toString(), centerX, centerY - 10)

    ctx.font = "12px Arial"
    ctx.fillStyle = "#666"
    ctx.fillText("Total", centerX, centerY + 15)
  }, [data, total, width, height])

  return <canvas ref={canvasRef} width={width} height={height} style={{ width: `${width}px`, height: `${height}px` }} />
}
