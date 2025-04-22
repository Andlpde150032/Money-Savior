"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useExpense } from "@/lib/expense-context"

export function MonthlyTrend() {
  const { transactions } = useExpense()

  // Get current and previous month
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const startOfCurrentMonth = new Date(currentYear, currentMonth, 1)
  const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0)

  const startOfPreviousMonth = new Date(currentYear, currentMonth - 1, 1)
  const endOfPreviousMonth = new Date(currentYear, currentMonth, 0)

  // Group expenses by week for current month
  const currentMonthExpenses = transactions.filter(
    (t) => t.type === "expense" && t.date >= startOfCurrentMonth && t.date <= endOfCurrentMonth,
  )

  const previousMonthExpenses = transactions.filter(
    (t) => t.type === "expense" && t.date >= startOfPreviousMonth && t.date <= endOfPreviousMonth,
  )

  // Group by week
  const getWeekNumber = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    return Math.ceil(((date.getTime() - firstDay.getTime()) / 86400000 + firstDay.getDay() + 1) / 7)
  }

  const currentMonthByWeek = currentMonthExpenses.reduce(
    (acc, transaction) => {
      const week = getWeekNumber(transaction.date)
      if (!acc[week]) {
        acc[week] = 0
      }
      acc[week] += transaction.amount
      return acc
    },
    {} as Record<number, number>,
  )

  const previousMonthByWeek = previousMonthExpenses.reduce(
    (acc, transaction) => {
      const week = getWeekNumber(transaction.date)
      if (!acc[week]) {
        acc[week] = 0
      }
      acc[week] += transaction.amount
      return acc
    },
    {} as Record<number, number>,
  )

  // Format data for chart
  const data = [1, 2, 3, 4, 5].map((week) => ({
    name: `Tuần ${week}`,
    "Tháng trước": previousMonthByWeek[week] || 0,
    "Tháng này": currentMonthByWeek[week] || 0,
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
        <Bar dataKey="Tháng trước" fill="#94a3b8" />
        <Bar dataKey="Tháng này" fill="#0ea5e9" />
      </BarChart>
    </ResponsiveContainer>
  )
}
