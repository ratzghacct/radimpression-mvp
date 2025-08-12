// Admin email list - you can modify this list
const ADMIN_EMAILS = ["admin@radimpression.com", "support@radimpression.com"]

export function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

export function calculateCost(tokens: number): number {
  // Cost calculation: $0.002 per 1000 tokens (OpenAI pricing)
  return (tokens / 1000) * 0.002
}

export function getAdminEmails(): string[] {
  return ADMIN_EMAILS
}
