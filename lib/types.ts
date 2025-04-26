export interface Category {
  id: string
  name: string
  widgets: string[] // Array of widget IDs
}

export interface Widget {
  id: string
  title: string
  content?: string
  type: string
  data: any
  categories: string[] // Array of category IDs
}

export interface DashboardState {
  categories: Category[]
  widgets: Widget[]
  getWidgetsByCategory: (categoryId: string) => Widget[]
  addWidgetToCategory: (widgetId: string, categoryId: string) => void
  removeWidgetFromCategory: (widgetId: string, categoryId: string) => void
  createWidget: (widget: Omit<Widget, "id">) => Widget
  searchWidgets: (query: string) => Widget[]
  getCategoryById: (categoryId: string) => Category | undefined
  getAllWidgets: () => Widget[]
}
