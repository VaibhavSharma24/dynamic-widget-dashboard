"use client"

import { useState, useEffect, useRef } from "react"
import { X, Search, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useWidgetStore } from "@/lib/store"
import type { Widget } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"

interface AddWidgetModalProps {
  isOpen: boolean
  onClose: () => void
  initialCategory?: string
}

export default function AddWidgetModal({ isOpen, onClose, initialCategory }: AddWidgetModalProps) {
  const { categories, widgets, addWidgetToCategory, createWidget, searchWidgets, getAllWidgets } = useWidgetStore()
  const [activeTab, setActiveTab] = useState(initialCategory ? getCategoryTabName(initialCategory) : "CSPM")
  const [selectedWidgets, setSelectedWidgets] = useState<string[]>([])
  const [newWidgetName, setNewWidgetName] = useState("")
  const [newWidgetContent, setNewWidgetContent] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "")
  const [isCreatingWidget, setIsCreatingWidget] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredWidgets, setFilteredWidgets] = useState<Widget[]>([])

  const searchInputRef = useRef<HTMLInputElement>(null)

  // Function to map category ID to tab name
  function getCategoryTabName(categoryId: string): string {
    if (categoryId === "cspm") return "CSPM"
    if (categoryId === "cwpp") return "CWPP"
    if (categoryId === "registry") return "Image"
    return "CSPM"
  }

  // Function to map tab name to category ID
  function getCategoryIdFromTab(tabName: string): string {
    if (tabName === "CSPM") return "cspm"
    if (tabName === "CWPP") return "cwpp"
    if (tabName === "Image") return "registry"
    if (tabName === "Ticket") return "ticket"
    return "cspm"
  }

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      // Focus search input when modal opens
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }, 100)
    } else {
      setTimeout(() => {
        setIsVisible(false)
      }, 300)
    }
  }, [isOpen])

  useEffect(() => {
    if (searchQuery.trim() === "") {
      // Filter widgets based on active tab
      const categoryId = getCategoryIdFromTab(activeTab)
      const widgetsForTab = getAllWidgets().filter((widget) => {
        if (activeTab === "CSPM") return widget.type.includes("cloud")
        if (activeTab === "CWPP") return widget.type.includes("alerts")
        if (activeTab === "Image") return widget.type.includes("image")
        return true
      })
      setFilteredWidgets(widgetsForTab)
    } else {
      // Search across all widgets
      setFilteredWidgets(searchWidgets(searchQuery))
    }
  }, [searchQuery, activeTab, getAllWidgets, searchWidgets])

  const handleConfirm = () => {
    if (selectedWidgets.length > 0) {
      const categoryId = getCategoryIdFromTab(activeTab)

      selectedWidgets.forEach((widgetId) => {
        addWidgetToCategory(widgetId, categoryId)
      })

      toast({
        title: "Widgets added",
        description: `${selectedWidgets.length} widget(s) have been added to the dashboard.`,
      })

      onClose()
      setSelectedWidgets([])
      setSearchQuery("")
    }
  }

  const handleCreateWidget = () => {
    if (newWidgetName && selectedCategory) {
      createWidget({
        title: newWidgetName,
        content: newWidgetContent || "Custom widget",
        type: "custom",
        data: {},
        categories: [selectedCategory],
      })

      toast({
        title: "Widget created",
        description: `"${newWidgetName}" has been added to the dashboard.`,
      })

      onClose() // Close the modal after creating
      setNewWidgetName("")
      setNewWidgetContent("")
      setSelectedCategory("")
      setIsCreatingWidget(false)
      setSearchQuery("")
    }
  }

  const handleCheckWidget = (widgetId: string) => {
    setSelectedWidgets((prev) => (prev.includes(widgetId) ? prev.filter((id) => id !== widgetId) : [...prev, widgetId]))
  }

  if (!isVisible && !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50">
      <div
        className={`fixed inset-y-0 right-0 w-[450px] bg-white shadow-xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="bg-indigo-900 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Add Widget</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-indigo-800 rounded-full h-8 w-8 transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {isCreatingWidget ? (
            <div className="space-y-4 py-4">
              <h3 className="font-medium">Create New Widget</h3>
              <div className="space-y-2">
                <Label htmlFor="widget-name">Widget Name</Label>
                <Input
                  id="widget-name"
                  value={newWidgetName}
                  onChange={(e) => setNewWidgetName(e.target.value)}
                  placeholder="Enter widget name"
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="widget-content">Widget Content</Label>
                <Input
                  id="widget-content"
                  value={newWidgetContent}
                  onChange={(e) => setNewWidgetContent(e.target.value)}
                  placeholder="Enter widget content"
                  className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="widget-category">Category</Label>
                <select
                  id="widget-category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsCreatingWidget(false)}
                  className="hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateWidget}
                  className="bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  disabled={!newWidgetName || !selectedCategory}
                >
                  Create Widget
                </Button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-500 mb-4">Personalise your dashboard by adding the following widget</p>

              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search widgets..."
                  className="pl-9 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="border-b mb-4">
                <div className="flex">
                  {["CSPM", "CWPP", "Image", "Ticket"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setActiveTab(tab)
                        setSearchQuery("")
                      }}
                      className={`px-4 py-2 text-sm font-medium transition-colors ${
                        activeTab === tab
                          ? "border-b-2 border-indigo-600 text-indigo-600"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto">
                {filteredWidgets.length > 0 ? (
                  filteredWidgets.map((widget) => (
                    <div
                      key={widget.id}
                      className={`flex items-center space-x-2 p-3 border rounded-md hover:bg-indigo-50 transition-colors ${
                        selectedWidgets.includes(widget.id) ? "bg-indigo-50 border-indigo-300" : ""
                      }`}
                    >
                      <Checkbox
                        id={widget.id}
                        checked={selectedWidgets.includes(widget.id)}
                        onCheckedChange={() => handleCheckWidget(widget.id)}
                        className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                      />
                      <div className="flex-1 cursor-pointer" onClick={() => handleCheckWidget(widget.id)}>
                        <Label htmlFor={widget.id} className="font-medium block">
                          {widget.title}
                        </Label>
                        {widget.content && <p className="text-sm text-gray-500 mt-1">{widget.content}</p>}
                      </div>
                      {selectedWidgets.includes(widget.id) && <Check className="h-4 w-4 text-indigo-600" />}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {searchQuery ? "No widgets found matching your search" : "No widgets available for this category"}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {!isCreatingWidget && (
          <div className="border-t p-4 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsCreatingWidget(true)}
              className="hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 transition-colors gap-1"
            >
              <Plus className="h-4 w-4" />
              Create New Widget
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} className="hover:bg-gray-100 transition-colors">
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-indigo-900 hover:bg-indigo-800 transition-colors"
                disabled={selectedWidgets.length === 0}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
