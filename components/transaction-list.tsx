"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { format, isSameDay } from "date-fns"
import { vi } from "date-fns/locale"
import { ArrowDownLeft, ArrowUpRight, Edit, MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useExpense } from "@/lib/expense-context"
import { CategoryIcon } from "@/components/category-icon"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/language-context"

interface TransactionListProps {
  filters?: {
    search: string
    date: Date | null
  }
}

export function TransactionList({ filters = { search: "", date: null } }: TransactionListProps) {
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const { transactions, categories, deleteTransaction } = useExpense()
  const [filter, setFilter] = useState<"all" | "expense" | "income">("all")

  // Apply filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Filter by type
      if (filter !== "all" && transaction.type !== filter) {
        return false
      }

      // Filter by search term
      if (filters?.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      // Filter by date
      if (filters?.date && !isSameDay(transaction.date, filters.date)) {
        return false
      }

      return true
    })
  }, [transactions, filter, filters?.search, filters?.date])

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    return filteredTransactions
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .reduce(
        (groups, transaction) => {
          const date = format(transaction.date, "yyyy-MM-dd")
          if (!groups[date]) {
            groups[date] = []
          }
          groups[date].push(transaction)
          return groups
        },
        {} as Record<string, typeof transactions>,
      )
  }, [filteredTransactions])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const handleDelete = (id: string) => {
    deleteTransaction(id)
    toast({
      title: t("transactionDeleted"),
      description: t("transactionDeletedSuccess"),
    })
  }

  if (Object.keys(groupedTransactions).length === 0) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold">{t("noTransactions")}</h3>
        <p className="text-muted-foreground">{t("startAddingTransactions")}</p>
        <Button className="mt-4" asChild>
          <Link href="/transactions/new">{t("addFirstTransaction")}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex gap-2">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
          {t("all")}
        </Button>
        <Button variant={filter === "expense" ? "default" : "outline"} size="sm" onClick={() => setFilter("expense")}>
          {t("expense")}
        </Button>
        <Button variant={filter === "income" ? "default" : "outline"} size="sm" onClick={() => setFilter("income")}>
          {t("income")}
        </Button>
      </div>

      {Object.entries(groupedTransactions).map(([date, transactions]) => (
        <div key={date} className="space-y-4">
          <h3 className="font-medium">
            {format(new Date(date), "EEEE, d MMMM yyyy", {
              locale: language === "vi" ? vi : undefined,
            })}
          </h3>
          <div className="space-y-2">
            {transactions.map((transaction) => {
              const category = categories.find((c) => c.id === transaction.category)
              return (
                <div key={transaction.id} className="flex items-center gap-4 rounded-lg border p-4">
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
                      {category?.name || (transaction.type === "income" ? t("income") : t("expense"))}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div
                      className={cn(
                        "font-medium",
                        transaction.type === "income" ? "text-emerald-500" : "text-destructive",
                      )}
                    >
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(transaction.amount)}
                    </div>
                    <div className="text-sm text-muted-foreground">{format(transaction.date, "HH:mm")}</div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">{t("options")}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/transactions/${transaction.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t("edit")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(transaction.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        {t("delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
