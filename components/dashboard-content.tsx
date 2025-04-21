"use client"
import Link from "next/link"
import { ArrowUpRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExpenseSummary } from "@/components/expense-summary"
import { RecentTransactions } from "@/components/recent-transactions"
import { ExpenseChart } from "@/components/expense-chart"
import { MonthlyTrend } from "@/components/monthly-trend"
import { useLanguage } from "@/lib/language-context"

export function DashboardContent() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("dashboardTitle")}</h1>
          <p className="text-muted-foreground">{t("dashboardDescription")}</p>
        </div>
        <Button asChild>
          <Link href="/transactions/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("addTransaction")}
          </Link>
        </Button>
      </div>

      <ExpenseSummary />

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="analytics">{t("analytics")}</TabsTrigger>
          <TabsTrigger value="recent">{t("recent")}</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>{t("expensesByCategory")}</CardTitle>
                <CardDescription>{t("expensesDistribution")}</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ExpenseChart />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>{t("spendingTrends")}</CardTitle>
                <CardDescription>{t("comparedToPrevMonth")}</CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyTrend />
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/reports">
                    {t("viewDetailedReport")}
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("detailedAnalysis")}</CardTitle>
              <CardDescription>{t("detailedSpendingAnalysis")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                {/* Placeholder for more detailed analytics */}
                <div className="flex h-full items-center justify-center rounded-md border border-dashed">
                  <p className="text-sm text-muted-foreground">Biểu đồ phân tích chi tiết sẽ hiển thị ở đây</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("recentTransactions")}</CardTitle>
              <CardDescription>{t("transactionsLast7Days")}</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/transactions">
                  {t("viewAllTransactions")}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
