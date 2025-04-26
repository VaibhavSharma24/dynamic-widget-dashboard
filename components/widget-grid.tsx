"use client"

import { Plus, X, Settings, Maximize2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWidgetStore } from "@/lib/store"
import type { Widget } from "@/lib/types"
import CloudAccountsWidget from "@/components/widgets/cloud-accounts-widget"
import RiskAssessmentWidget from "@/components/widgets/risk-assessment-widget"
import AlertsWidget from "@/components/widgets/alerts-widget"
import ImageRiskWidget from "@/components/widgets/image-risk-widget"
import ImageSecurityWidget from "@/components/widgets/image-security-widget"
import { useState } from "react"
import AddWidgetModal from "@/components/add-widget-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

interface WidgetGridProps {
  categoryId: string
}

export default function WidgetGrid({ categoryId }: WidgetGridProps) {
  const { getWidgetsByCategory, removeWidgetFromCategory, getCategoryById } = useWidgetStore()
  const [isAddingWidget, setIsAddingWidget] = useState(false)
  const [, forceUpdate] = useState({})

  // Force component to update when modal closes
  const handleModalClose = () => {
    setIsAddingWidget(false)
    forceUpdate({})
  }

  const widgets = getWidgetsByCategory(categoryId)
  const category = getCategoryById(categoryId)

  const handleRemoveWidget = (widgetId: string) => {
    removeWidgetFromCategory(widgetId, categoryId)
    toast({
      title: "Widget removed",
      description: "The widget has been removed from this category.",
      variant: "destructive",
    })
  }

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case "cloudAccounts":
        return <CloudAccountsWidget data={widget.data} />
      case "riskAssessment":
        return <RiskAssessmentWidget data={widget.data} />
      case "alerts":
        return <AlertsWidget data={widget.data} title={widget.title} />
      case "imageRisk":
        return <ImageRiskWidget data={widget.data} />
      case "imageSecurity":
        return <ImageSecurityWidget data={widget.data} />
      default:
        return (
          <div className="p-4">
            <h3 className="font-medium">{widget.title}</h3>
            <p className="text-sm text-gray-500">{widget.content}</p>
          </div>
        )
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {widgets.map((widget) => (
        <div
          key={widget.id}
          className="bg-white rounded-lg border border-gray-200 shadow-sm relative hover:shadow-lg hover:border-indigo-300 transition-all duration-200 group"
        >
          <div className="absolute top-2 right-2 flex items-center gap-1 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    toast({
                      title: "Widget settings",
                      description: `Settings for: ${widget.title}`,
                    })
                  }}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                  onClick={() => {
                    toast({
                      title: "Widget expanded",
                      description: `${widget.title} is now in fullscreen mode.`,
                    })
                  }}
                >
                  <Maximize2 className="h-4 w-4 mr-2" />
                  <span>Expand</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors"
                  onClick={() => handleRemoveWidget(widget.id)}
                >
                  <X className="h-4 w-4 mr-2" />
                  <span>Remove</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              onClick={() => handleRemoveWidget(widget.id)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Remove widget</span>
            </Button>
          </div>
          <div className="relative overflow-hidden">
            {renderWidget(widget)}
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          </div>
        </div>
      ))}

      <Button
        variant="ghost"
        className="border border-dashed rounded-lg h-[200px] flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all hover:border-indigo-300 group"
        onClick={() => setIsAddingWidget(true)}
      >
        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-gray-100 group-hover:bg-indigo-100 transition-colors">
          <Plus className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </div>
        <span className="font-medium">Add Widget to {category?.name}</span>
      </Button>

      {isAddingWidget && (
        <AddWidgetModal isOpen={isAddingWidget} onClose={handleModalClose} initialCategory={categoryId} />
      )}
    </div>
  )
}
