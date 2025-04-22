"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format, eachDayOfInterval, isSameDay } from "date-fns"

import { useExpense } from "@/lib/expense-context"
import { useLanguage } from "@/lib/language-context"

interface ExpenseBarChartProps {
  dateRange: {
    from: Date
    to: Date
  }
}

export function ExpenseBarChart({ dateRange }: ExpenseBarChartProps) {
  const { transactions } = useExpense()
  const { t } = useLanguage()

  // Get all days in the date range
  const days = eachDayOfInterval({
    start: dateRange.from,
    end: dateRange.to,
  })

  // Group expenses by day
  const expensesByDay = days.map((day) => {
    const dayExpenses = transactions.filter((t) => t.type === "expense" && isSameDay(t.date, day))

    const dayIncomes = transactions.filter((t) => t.type === "income" && isSameDay(t.date, day))

    return {
      date: day,
      expense: dayExpenses.reduce((sum, t) => sum + t.amount, 0),
      income: dayIncomes.reduce((sum, t) => sum + t.amount, 0),
    }
  })

  // Format data for chart
  const data = expensesByDay.map((day) => ({
    name: format(day.date, "dd/MM"),
    [t("expense")]: day.expense,
    [t("income")]: day.income,
  }))

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => formatCurrency(value)} />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Bar dataKey={t("expense")} fill="#ef4444" />
        <Bar dataKey={t("income")} fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  )
}
