"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { v4 as uuidv4 } from "uuid"
import type { DashboardState, Widget, Category } from "./types"

// Initial data for the dashboard
const initialCategories: Category[] = [
  {
    id: "cspm",
    name: "CSPM Executive Dashboard",
    widgets: ["cloud-accounts", "risk-assessment"],
  },
  {
    id: "cwpp",
    name: "CWPP Dashboard",
    widgets: ["namespace-alerts", "workload-alerts"],
  },
  {
    id: "registry",
    name: "Registry Scan",
    widgets: ["image-risk", "image-security"],
  },
]

const initialWidgets: Widget[] = [
  {
    id: "cloud-accounts",
    title: "Cloud Accounts",
    type: "cloudAccounts",
    content: "Shows connected and disconnected cloud accounts",
    data: {
      total: 2,
      connected: 1,
      notConnected: 1,
    },
    categories: ["cspm"],
  },
  {
    id: "risk-assessment",
    title: "Cloud Account Risk Assessment",
    type: "riskAssessment",
    content: "Displays risk assessment for cloud accounts",
    data: {
      total: 9659,
      failed: 1689,
      warning: 681,
      notAvailable: 36,
      passed: 7253,
    },
    categories: ["cspm"],
  },
  {
    id: "namespace-alerts",
    title: "Top 5 Namespace Specific Alerts",
    type: "alerts",
    content: "Shows top namespace alerts",
    data: {},
    categories: ["cwpp"],
  },
  {
    id: "workload-alerts",
    title: "Workload Alerts",
    type: "alerts",
    content: "Displays workload alerts",
    data: {},
    categories: ["cwpp"],
  },
  {
    id: "image-risk",
    title: "Image Risk Assessment",
    type: "imageRisk",
    content: "Shows risk assessment for images",
    data: {
      total: 1470,
      critical: 9,
      high: 150,
    },
    categories: ["registry"],
  },
  {
    id: "image-security",
    title: "Image Security Issues",
    type: "imageSecurity",
    content: "Displays security issues for images",
    data: {
      total: 2,
      critical: 2,
      high: 2,
    },
    categories: ["registry"],
  },
]

export const useWidgetStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      categories: initialCategories,
      widgets: initialWidgets,

      getWidgetsByCategory: (categoryId: string) => {
        const category = get().categories.find((c) => c.id === categoryId)
        if (!category) return []

        return get().widgets.filter((widget) => category.widgets.includes(widget.id))
      },

      addWidgetToCategory: (widgetId: string, categoryId: string) => {
        set((state) => {
          // Check if the widget is already in the category
          const category = state.categories.find((c) => c.id === categoryId)
          if (category && category.widgets.includes(widgetId)) {
            return state // No change needed
          }

          const categories = state.categories.map((category) => {
            if (category.id === categoryId) {
              return {
                ...category,
                widgets: [...category.widgets, widgetId],
              }
            }
            return category
          })

          const widgets = state.widgets.map((widget) => {
            if (widget.id === widgetId && !widget.categories.includes(categoryId)) {
              return {
                ...widget,
                categories: [...widget.categories, categoryId],
              }
            }
            return widget
          })

          return { categories, widgets }
        })
      },

      removeWidgetFromCategory: (widgetId: string, categoryId: string) => {
        set((state) => {
          const categories = state.categories.map((category) => {
            if (category.id === categoryId) {
              return {
                ...category,
                widgets: category.widgets.filter((id) => id !== widgetId),
              }
            }
            return category
          })

          const widgets = state.widgets.map((widget) => {
            if (widget.id === widgetId) {
              return {
                ...widget,
                categories: widget.categories.filter((id) => id !== categoryId),
              }
            }
            return widget
          })

          return { categories, widgets }
        })
      },

      createWidget: (widget) => {
        const newWidget: Widget = {
          ...widget,
          id: uuidv4(),
        }

        set((state) => {
          const updatedWidgets = [...state.widgets, newWidget]

          const updatedCategories = state.categories.map((category) => {
            if (widget.categories.includes(category.id)) {
              return {
                ...category,
                widgets: [...category.widgets, newWidget.id],
              }
            }
            return category
          })

          return {
            widgets: updatedWidgets,
            categories: updatedCategories,
          }
        })

        return newWidget
      },

      searchWidgets: (query: string) => {
        const widgets = get().widgets
        if (!query.trim()) return widgets

        const lowerQuery = query.toLowerCase()
        return widgets.filter(
          (widget) =>
            widget.title.toLowerCase().includes(lowerQuery) ||
            (widget.content && widget.content.toLowerCase().includes(lowerQuery)) ||
            widget.type.toLowerCase().includes(lowerQuery),
        )
      },

      getCategoryById: (categoryId: string) => {
        return get().categories.find((c) => c.id === categoryId)
      },

      getAllWidgets: () => {
        return get().widgets
      },
    }),
    {
      name: "dashboard-storage",
    },
  ),
)
