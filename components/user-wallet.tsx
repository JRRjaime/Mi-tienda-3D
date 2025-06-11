"use client"

import { AdvancedWallet } from "@/components/wallet/advanced-wallet"

interface UserWalletProps {
  user: {
    balance?: number
    email?: string
    name?: string
  }
}

export function UserWallet({ user }: UserWalletProps) {
  return <AdvancedWallet />
}
