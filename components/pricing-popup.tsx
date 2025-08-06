"use client"

import { PricingSection } from "./pricing-section"

interface PricingPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function PricingPopup({ isOpen, onClose }: PricingPopupProps) {
  if (!isOpen) return null

  return <PricingSection showAsPopup={true} onClose={onClose} />
}
