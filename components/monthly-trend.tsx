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

  // Custom formatter for currency values on the y-axis
  const formatCurrency = (value: number) => {
    if (value === 0) return "0 đ";

    // For small values, show without abbreviation
    if (value < 1000) return `${value} đ`;

    // For values in thousands (1K-999K)
    if (value < 1000000) {
      return `${Math.round(value/1000)}K đ`;
    }

    // For values in millions (1M+)
    return `${(value/1000000).toFixed(1)}M đ`;
  };

  // Find the maximum value to set appropriate Y-axis ticks
  const allValues = data.flatMap(item => [
    Number(item["Tháng trước"] || 0),
    Number(item["Tháng này"] || 0)
  ]);

  // Ensure we have a reasonable minimum max value
  const maxValue = Math.max(...allValues, 10000);

  // Calculate appropriate tick values based on the maximum value
  const getTickValues = (max: number) => {
    // For very small values
    if (max < 5000) {
      return [0, 1000, 2000, 3000, 4000, 5000];
    }

    // For medium values
    if (max < 100000) {
      const step = Math.ceil(max / 5 / 1000) * 1000;
      return [0, step, step * 2, step * 3, step * 4, step * 5];
    }

    // For large values
    const step = Math.ceil(max / 5 / 100000) * 100000;
    return [0, step, step * 2, step * 3, step * 4, step * 5];
  };

  const tickValues = getTickValues(maxValue);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis
          tickFormatter={(value) => formatCurrency(value)}
          ticks={tickValues}
          domain={[0, 'dataMax + 10000']} // Add some padding at the top
          width={60} // Give more space for the y-axis labels
        />
        <Tooltip
          formatter={(value: number) => {
            return [
              new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                maximumFractionDigits: 0,
              }).format(value),
              ""
            ];
          }}
          labelFormatter={(label) => label}
        />
        <Bar dataKey="Tháng trước" fill="#94a3b8" name="Tháng trước" />
        <Bar dataKey="Tháng này" fill="#0ea5e9" name="Tháng này" />
      </BarChart>
    </ResponsiveContainer>
  )
}
