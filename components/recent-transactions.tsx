"use client"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { useExpense } from "@/lib/expense-context"
import { CategoryIcon } from "@/components/category-icon"
import { useLanguage } from "@/lib/language-context"

export function RecentTransactions() {
  const { transactions, categories } = useExpense()
  const { t, language } = useLanguage()

  // Get transactions from the last 7 days
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const recentTransactions = transactions
    .filter((t) => t.date >= sevenDaysAgo)
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  if (recentTransactions.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <p className="text-muted-foreground">{t("noTransactionsLast7Days")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recentTransactions.map((transaction) => {
        const category = categories.find((c) => c.id === transaction.category)
        return (
          <div key={transaction.id} className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              {category ? (
                <CategoryIcon name={category.icon} className="h-5 w-5" style={{ color: category.color }} />
              ) : transaction.type === "income" ? (
                <ArrowUpRight className="h-5 w-5 text-emerald-500" />
              ) : (
                <ArrowDownLeft className="h-5 w-5 text-destructive" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium leading-none">{transaction.description}</p>
              <p className="text-sm text-muted-foreground">
                {category?.name || (transaction.type === "income" ? t("income") : t("expense"))} •{" "}
                {format(transaction.date, "d MMMM", {
                  locale: language === "vi" ? vi : undefined,
                })}
              </p>
            </div>
            <div className={cn("font-medium", transaction.type === "income" ? "text-emerald-500" : "text-destructive")}>
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(transaction.amount)}
            </div>
          </div>
        )
      })}
    </div>
  )
}
