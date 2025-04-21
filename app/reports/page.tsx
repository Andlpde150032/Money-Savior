"use client"

import { useState } from "react"
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

export default function ReportsPage() {
  const { toast } = useToast()
  const { transactions, categories } = useExpense()
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  })

  const handleExportExcel = async () => {
    try {
      await exportToExcel(transactions, categories, dateRange)
      toast({
        title: "Xuất Excel thành công",
        description: "File Excel đã được tải xuống.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xuất Excel thất bại",
        description: "Đã xảy ra lỗi khi xuất file Excel.",
      })
    }
  }

  const dateRangeText = `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Báo cáo</h1>
          <p className="text-muted-foreground">Phân tích chi tiêu và xuất báo cáo</p>
        </div>
        <Button onClick={handleExportExcel}>
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Xuất Excel
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
        <Button variant="outline" size="sm" onClick={handleExportExcel}>
          <Download className="mr-2 h-4 w-4" />
          Tải xuống ({dateRangeText})
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="categories">Theo danh mục</TabsTrigger>
          <TabsTrigger value="trends">Xu hướng</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Tổng chi tiêu</CardTitle>
                <CardDescription>Tổng chi tiêu trong khoảng thời gian</CardDescription>
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
                <CardTitle>Tổng thu nhập</CardTitle>
                <CardDescription>Tổng thu nhập trong khoảng thời gian</CardDescription>
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
                <CardTitle>Số dư</CardTitle>
                <CardDescription>Thu nhập - Chi tiêu trong khoảng thời gian</CardDescription>
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
              <CardTitle>Chi tiêu theo thời gian</CardTitle>
              <CardDescription>Biểu đồ chi tiêu trong khoảng thời gian đã chọn</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpenseBarChart dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Chi tiêu theo danh mục</CardTitle>
              <CardDescription>Phân bổ chi tiêu theo từng danh mục</CardDescription>
            </CardHeader>
            <CardContent>
              <ExpensePieChart dateRange={dateRange} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Xu hướng chi tiêu</CardTitle>
              <CardDescription>Biểu đồ xu hướng chi tiêu theo thời gian</CardDescription>
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
