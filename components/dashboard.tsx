"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Plus,
  RotateCw,
  MoreVertical,
  X,
  Bell,
  User,
  Calendar,
  ChevronDown,
  LogOut,
  Settings,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useWidgetStore } from "@/lib/store"
import AddWidgetModal from "@/components/add-widget-modal"
import WidgetGrid from "@/components/widget-grid"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"

export default function Dashboard() {
  const { categories, widgets, searchWidgets } = useWidgetStore()
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredWidgets, setFilteredWidgets] = useState(widgets)
  const [searchResults, setSearchResults] = useState<{ categoryId: string; widgets: any[] }[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [dateRange, setDateRange] = useState("Last 2 days")

  // Add this function to handle modal close and refresh
  const handleAddWidgetClose = () => {
    setIsAddWidgetOpen(false)
    setRefreshKey((prev) => prev + 1)
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
    toast({
      title: "Dashboard refreshed",
      description: "Your dashboard has been refreshed with the latest data.",
      action: <ToastAction altText="Undo">Undo</ToastAction>,
    })
  }

  // Update useEffect to include refreshKey in dependencies
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setIsSearching(false)
      setFilteredWidgets(widgets)
      setSearchResults([])
    } else {
      setIsSearching(true)
      const results = searchWidgets(searchQuery)
      setFilteredWidgets(results)

      // Group search results by category
      const groupedResults = categories
        .map((category) => {
          const categoryWidgets = results.filter((widget) => widget.categories.includes(category.id))
          return {
            categoryId: category.id,
            widgets: categoryWidgets,
          }
        })
        .filter((group) => group.widgets.length > 0)

      setSearchResults(groupedResults)
    }
  }, [searchQuery, widgets, categories, searchWidgets, refreshKey])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isAddWidgetOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isAddWidgetOpen])

  const dateOptions = ["Last 24 hours", "Last 2 days", "Last 7 days", "Last 30 days", "Custom range"]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="flex items-center h-14 px-4">
          <div className="flex items-center gap-2 text-sm">
            <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
              HOME
            </a>
            <span className="text-gray-400">&gt;</span>
            <span className="font-medium">Dashboard V2</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search anything..."
                className="w-[300px] pl-9 h-9 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors rounded-full relative"
                  >
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-2">
                    <span className="font-medium">Notifications</span>
                    <Button variant="ghost" size="sm" className="text-xs text-indigo-600 hover:text-indigo-700">
                      Mark all as read
                    </Button>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="max-h-80 overflow-y-auto">
                    <div className="p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="font-medium text-sm">New security alert</div>
                      <div className="text-xs text-gray-500 mt-1">
                        A new security vulnerability was detected in your cloud account.
                      </div>
                      <div className="text-xs text-gray-400 mt-1">2 minutes ago</div>
                    </div>
                    <div className="p-3 hover:bg-gray-50 transition-colors cursor-pointer">
                      <div className="font-medium text-sm">Dashboard updated</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Your dashboard has been updated with new widgets.
                      </div>
                      <div className="text-xs text-gray-400 mt-1">1 hour ago</div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <div className="p-2 text-center">
                    <Button variant="ghost" size="sm" className="text-xs text-indigo-600 hover:text-indigo-700">
                      View all notifications
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="h-8 w-8 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors p-0 flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center gap-2 p-2">
                    <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Admin User</div>
                      <div className="text-xs text-gray-500">admin@example.com</div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                    <User className="h-4 w-4 mr-2" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                    <Settings className="h-4 w-4 mr-2" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    <span>Help</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer hover:bg-red-50 hover:text-red-600 transition-colors">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">CNAPP Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="gap-2 bg-white hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-gray-200 hover:border-indigo-300"
              onClick={() => setIsAddWidgetOpen(true)}
            >
              <span>Add Widget</span>
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="bg-white hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-gray-200 hover:border-indigo-300"
              onClick={handleRefresh}
            >
              <RotateCw className="h-4 w-4" />
              <span className="sr-only">Refresh</span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white hover:bg-indigo-50 hover:text-indigo-600 transition-colors border-gray-200 hover:border-indigo-300"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">More</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                  Export Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                  Print Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                  Share Dashboard
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 transition-colors">
                  Reset Layout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
              <PopoverTrigger asChild>
                <div className="flex items-center gap-2 ml-2 border rounded-md px-3 py-1.5 bg-white hover:bg-indigo-50 hover:border-indigo-300 transition-colors cursor-pointer">
                  <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs">
                    <Calendar className="h-3 w-3" />
                  </div>
                  <span>{dateRange}</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0">
                <div className="py-1">
                  {dateOptions.map((option) => (
                    <div
                      key={option}
                      className="px-3 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer transition-colors"
                      onClick={() => {
                        setDateRange(option)
                        toast({
                          title: "Date range updated",
                          description: `Dashboard now showing data for: ${option}`,
                        })
                      }}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="space-y-6">
          {isSearching ? (
            searchResults.length > 0 ? (
              searchResults.map(({ categoryId, widgets }) => {
                const category = categories.find((c) => c.id === categoryId)
                return (
                  <div key={categoryId} className="space-y-4">
                    <h2 className="text-lg font-medium">{category?.name} - Search Results</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {widgets.map((widget) => (
                        <div
                          key={widget.id}
                          className="bg-white rounded-lg border border-gray-200 shadow-sm relative hover:shadow-md hover:border-indigo-300 transition-all duration-200"
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 text-gray-400 hover:text-red-600 hover:bg-red-50 z-10 transition-colors"
                            onClick={() => {
                              /* Cannot remove from search results */
                            }}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove widget</span>
                          </Button>
                          <div className="p-4">
                            <h3 className="font-medium">{widget.title}</h3>
                            <p className="text-sm text-gray-500">{widget.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border">
                <p className="text-gray-500">No widgets found matching your search</p>
              </div>
            )
          ) : (
            categories.map((category) => (
              <div key={category.id} className="space-y-4">
                <h2 className="text-lg font-medium">{category.name}</h2>
                <WidgetGrid categoryId={category.id} />
              </div>
            ))
          )}
        </div>
      </main>

      {/* Update the AddWidgetModal call */}
      <AddWidgetModal isOpen={isAddWidgetOpen} onClose={handleAddWidgetClose} />
    </div>
  )
}
