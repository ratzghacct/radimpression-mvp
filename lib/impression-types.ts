export interface ImpressionHistory {
  id: string
  userId: string
  findings: string
  impression: string
  tokenUsage: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
    cost: number
    format?: string
  }
  createdAt: Date
  model: string
}

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  cost: number
  format?: string
}

export interface GenerationRequest {
  findings: string
  userId: string
  userEmail: string
  userName: string
  format: string
}

export interface UserPlan {
  plan: string
  email: string
  uid: string
}

export interface ImpressionState {
  findings: string
  impression: string
  isGenerating: boolean
  tokenUsage: TokenUsage | null
  history: ImpressionHistory[]
  searchTerm: string
  activeTab: string
  showFullPricing: boolean
  showPricingPopup: boolean
  lastGeneratedAt: Date | null
  showPricing: boolean
  format: string
}

export interface EditorState {
  undoStack: string[]
  redoStack: string[]
}
