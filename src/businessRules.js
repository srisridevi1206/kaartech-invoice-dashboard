export const statusOptions = ['All statuses', 'Awaiting Approval', 'In Review', 'Escalated', 'Resolved']
export const riskOptions = ['All risk levels', 'Critical', 'High', 'Medium', 'Low']

export function validateException(record) {
  const errors = []
  if (!record.supplier?.trim()) errors.push('Supplier is required')
  if (!record.id?.trim()) errors.push('Document number is required')
  if (!Number.isFinite(record.amount) || record.amount <= 0) errors.push('Amount must be greater than zero')
  if (!record.companyCode || !record.plant) errors.push('Company code and plant are required')
  return errors
}

export function calculateRisk(record) {
  if (record.duplicate || record.amount > 100000) return 'Critical'
  if (record.amount > 50000 || record.status === 'Escalated') return 'High'
  if (record.amount > 15000) return 'Medium'
  return 'Low'
}

export function getAgeDays(created, today = new Date('2026-10-12')) {
  return Math.max(0, Math.round((today - new Date(created)) / 86400000))
}