"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TransactionList } from "@/components/transaction-list"
import { TransactionFilter } from "@/components/transaction-filter"
import { useLanguage } from "@/lib/language-context"

export default function TransactionsPage() {
  const { t } = useLanguage()
  const [filters, setFilters] = useState<{ search: string; date: Date | null }>({
    search: "",
    date: null,
  })

  // Use useCallback to memoize the function and prevent it from being recreated on each render
  const handleFilterChange = useCallback((newFilters: { search: string; date: Date | null }) => {
    setFilters(newFilters)
  }, [])

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("transactionsTitle")}</h1>
          <p className="text-muted-foreground">{t("transactionsDescription")}</p>
        </div>
        <Button asChild>
          <Link href="/transactions/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("addTransaction")}
          </Link>
        </Button>
      </div>

      <TransactionFilter onFilterChange={handleFilterChange} />

      <TransactionList filters={filters} />
    </div>
  )
}
