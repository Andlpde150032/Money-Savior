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

  // Format for tooltip (full currency format)
  const formatTooltipCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Find the maximum value to set appropriate Y-axis ticks
  const allValues = data.flatMap(item => [
    Number(item[t("expense")] || 0),
    Number(item[t("income")] || 0)
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
          labelFormatter={(label) => `Ngày ${label}`}
        />
        <Bar dataKey={t("expense")} fill="#ef4444" name={t("expense")} />
        <Bar dataKey={t("income")} fill="#10b981" name={t("income")} />
      </BarChart>
    </ResponsiveContainer>
  )
}
