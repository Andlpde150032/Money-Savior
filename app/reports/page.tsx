"use client"

import { useState, useEffect } from "react"
import { Download, FileSpreadsheet } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/date-range-picker"
import { ExpenseBarChart } from "@/components/expense-bar-chart"
import { ExpensePieChart } from "@/components/expense-pie-chart"
import { ExpenseLineChart } from "@/components/expense-line-chart"
import { useExpense } from "@/lib/expense-context"
import { exportToExcel } from "@/lib/excel-export"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/language-context"

export default function ReportsPage() {
  const { toast } = useToast()
  const { transactions, categories } = useExpense()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleExportExcel = async () => {
    try {
      await exportToExcel(transactions, categories, dateRange)
      toast({
        title: t("exportSuccess"),
        description: t("excelDownloaded"),
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("exportFailed"),
        description: t("errorExportingExcel"),
      })
    }
  }

  const dateRangeText = `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`

  if (!mounted) {
    return null // Prevent hydration mismatch
  }

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("reportsTitle")}</h1>
          <p className="text-muted-foreground">{t("reportsDescription")}</p>
        </div>
        <Button onClick={handleExportExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          {t("exportExcel")}
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        <Button variant="outline" size="sm" onClick={handleExportExcel}>
          <Download className="mr-2 h-4 w-4" />
          {t("download")} ({dateRangeText})
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t("overviewTab")}</TabsTrigger>
          <TabsTrigger value="categories">{t("categoriesTab")}</TabsTrigger>
          <TabsTrigger value="trends">{t("trendsTab")}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t("totalExpenses")}</CardTitle>
                <CardDescription>{t("totalExpensesInPeriod")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(
                    transactions
                      .filter((t) => t.type === "expense" && t.date >= dateRange.from && t.date <= dateRange.to)
                      .reduce((sum, t) => sum + t.amount, 0),
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t("totalIncome")}</CardTitle>
                <CardDescription>{t("totalIncomeInPeriod")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(
                    transactions
                      .filter((t) => t.type === "income" && t.date >= dateRange.from && t.date <= dateRange.to)
                      .reduce((sum, t) => sum + t.amount, 0),
                  )}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{t("balance")}</CardTitle>
                <CardDescription>{t("incomeMinusExpenses")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(
                    transactions
                      .filter((t) => t.date >= dateRange.from && t.date <= dateRange.to)
                      .reduce((sum, t) => (t.type === "income" ? sum + t.amount : sum - t.amount), 0),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t("expensesByTime")}</CardTitle>
              <CardDescription>{t("expensesChartInPeriod")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseBarChart dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("expensesByCategories")}</CardTitle>
              <CardDescription>{t("expensesDistributionByCategory")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpensePieChart dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("spendingTrendsTitle")}</CardTitle>
              <CardDescription>{t("spendingTrendsOverTime")}</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseLineChart dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
