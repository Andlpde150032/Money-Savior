"use client"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useExpense } from "@/lib/expense-context"
import { useLanguage } from "@/lib/language-context"
import { useEffect, useState } from "react"

export function ExpenseChart() {
  const { transactions, categories } = useExpense()
  const { t } = useLanguage()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Get current month transactions
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

  const monthlyExpenses = transactions.filter(
    (t) => t.type === "expense" && t.date >= startOfMonth && t.date <= endOfMonth,
  )

  // Group expenses by category
  const expensesByCategory = monthlyExpenses.reduce(
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
        name: category?.name || t("other"),
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
        <p className="text-muted-foreground">{t("noExpensesThisMonth")}</p>
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
          label={({ percent }) => {
            const percentage = (percent * 100).toFixed(0);
            // Only show percentage if it's significant (e.g., > 5%)
            return percent > 0.05 ? `${percentage}%` : '';
          }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => formatCurrency(value)} />
        <Legend
          layout={isMobile ? "vertical" : "horizontal"}
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{
            fontSize: isMobile ? '12px' : '14px',
            paddingTop: '20px',
            maxWidth: isMobile ? '100%' : 'auto',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            justifyContent: 'center',
            gap: '8px'
          }}
          formatter={(value, entry) => (
            <span style={{ marginLeft: '4px' }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
