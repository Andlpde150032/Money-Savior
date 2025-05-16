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

  // Custom formatter for currency values on the y-axis
  const formatCurrency = (value: number) => {
    if (value === 0) return "0 đ";

    // For small values, show without abbreviation
    if (Math.abs(value) < 1000) return `${value} đ`;

    // For values in thousands (1K-999K)
    if (Math.abs(value) < 1000000) {
      const sign = value < 0 ? "-" : "";
      return `${sign}${Math.round(Math.abs(value)/1000)}K đ`;
    }

    // For values in millions (1M+)
    const sign = value < 0 ? "-" : "";
    return `${sign}${(Math.abs(value)/1000000).toFixed(1)}M đ`;
  };

  // Find the maximum value to set appropriate Y-axis ticks
  const allValues = data.flatMap(item => [
    Number(item[t("totalExpensesLabel")] || 0),
    Number(item[t("totalIncomeLabel")] || 0),
    Number(item[t("balanceLabel")] || 0)
  ]);

  const maxValue = Math.max(...allValues, 10000); // Ensure at least 10000 as minimum max value
  const minValue = Math.min(0, ...allValues); // Get the minimum value, could be negative for balance

  // Calculate appropriate tick values based on the maximum and minimum values
  const getTickValues = (min: number, max: number) => {
    // Handle case with negative values (balance might be negative)
    if (min < 0) {
      const range = max - min;
      const steps = 5; // Number of steps we want

      // For small ranges
      if (range < 10000) {
        const step = Math.ceil(range / steps / 1000) * 1000;
        return [
          Math.floor(min / step) * step,
          Math.floor(min / step) * step + step,
          0,
          step,
          Math.ceil(max / step) * step
        ];
      }

      // For medium ranges
      if (range < 100000) {
        const step = Math.ceil(range / steps / 10000) * 10000;
        return [
          Math.floor(min / step) * step,
          Math.floor(min / step) * step + step,
          0,
          step,
          Math.ceil(max / step) * step
        ];
      }

      // For large ranges
      const step = Math.ceil(range / steps / 100000) * 100000;
      return [
        Math.floor(min / step) * step,
        Math.floor(min / step) * step + step,
        0,
        step,
        Math.ceil(max / step) * step
      ];
    }

    // For positive-only values
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

  const tickValues = getTickValues(minValue, maxValue);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" />
        <YAxis
          tickFormatter={(value) => formatCurrency(value)}
          ticks={tickValues}
          domain={[minValue < 0 ? minValue - 10000 : 0, maxValue + 10000]} // Add some padding
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
        <Line type="monotone" dataKey={t("totalExpensesLabel")} stroke="#ef4444" name={t("totalExpensesLabel")} />
        <Line type="monotone" dataKey={t("totalIncomeLabel")} stroke="#10b981" name={t("totalIncomeLabel")} />
        <Line type="monotone" dataKey={t("balanceLabel")} stroke="#3b82f6" name={t("balanceLabel")} />
      </LineChart>
    </ResponsiveContainer>
  )
}
