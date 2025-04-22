"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format, eachDayOfInterval, isSameDay } from "date-fns"

import { useExpense } from "@/lib/expense-context"
import { useLanguage } from "@/lib/language-context"

interface ExpenseLineChartProps {
  dateRange: {
    from: Date
    to: Date
  }
}

export function ExpenseLineChart({ dateRange }: ExpenseLineChartProps) {
  const { transactions } = useExpense()
  const { t } = useLanguage()

  // Get all days in the date range
  const days = eachDayOfInterval({
    start: dateRange.from,
    end: dateRange.to,
  })

  // Calculate cumulative expenses
  let cumulativeExpense = 0
  let cumulativeIncome = 0

  const cumulativeData = days.map((day) => {
    const dayExpenses = transactions.filter((t) => t.type === "expense" && isSameDay(t.date, day))

    const dayIncomes = transactions.filter((t) => t.type === "income" && isSameDay(t.date, day))

    cumulativeExpense += dayExpenses.reduce((sum, t) => sum + t.amount, 0)
    cumulativeIncome += dayIncomes.reduce((sum, t) => sum + t.amount, 0)

    return {
      date: day,
      totalExpense: cumulativeExpense,
      totalIncome: cumulativeIncome,
      balance: cumulativeIncome - cumulativeExpense,
    }
  })

  // Format data for chart
  const data = cumulativeData.map((day) => ({
    name: format(day.date, "dd/MM"),
    [t("totalExpensesLabel")]: day.totalExpense,
    [t("totalIncomeLabel")]: day.totalIncome,
    [t("balanceLabel")]: day.balance,
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
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis tickFormatter={(value) => formatCurrency(value)} />
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Line type="monotone" dataKey={t("totalExpensesLabel")} stroke="#ef4444" />
        <Line type="monotone" dataKey={t("totalIncomeLabel")} stroke="#10b981" />
        <Line type="monotone" dataKey={t("balanceLabel")} stroke="#3b82f6" />
      </LineChart>
    </ResponsiveContainer>
  )
}
