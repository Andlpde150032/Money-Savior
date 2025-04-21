"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useExpense } from "@/lib/expense-context"

interface ExpensePieChartProps {
  dateRange: {
    from: Date
    to: Date
  }
}

export function ExpensePieChart({ dateRange }: ExpensePieChartProps) {
  const { transactions, categories } = useExpense()

  // Get expenses in the date range
  const rangeExpenses = transactions.filter(
    (t) => t.type === "expense" && t.date >= dateRange.from && t.date <= dateRange.to,
  )

  // Group expenses by category
  const expensesByCategory = rangeExpenses.reduce(
    (acc, transaction) => {
      const categoryId = transaction.category
      if (!acc[categoryId]) {
        acc[categoryId] = 0
      }
      acc[categoryId] += transaction.amount
      return acc
    },
    {} as Record<string, number>,
  )

  // Format data for chart
  const data = Object.entries(expensesByCategory)
    .map(([categoryId, amount]) => {
      const category = categories.find((c) => c.id === categoryId)
      return {
        name: category?.name || "Khác",
        value: amount,
        color: category?.color || "#888888",
      }
    })
    .sort((a, b) => b.value - a.value)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value)
  }

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <p className="text-muted-foreground">Không có dữ liệu chi tiêu trong khoảng thời gian này</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
