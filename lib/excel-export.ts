import ExcelJS from "exceljs"
import { format } from "date-fns"
import type { Transaction, Category } from "@/lib/expense-context"

export async function exportToExcel(
  transactions: Transaction[],
  categories: Category[],
  dateRange: { from: Date; to: Date },
) {
  // Filter transactions by date range
  const filteredTransactions = transactions.filter((t) => t.date >= dateRange.from && t.date <= dateRange.to)

  // Create a new workbook
  const workbook = new ExcelJS.Workbook()
  workbook.creator = "Money Savior"
  workbook.lastModifiedBy = "Money Savior"
  workbook.created = new Date()
  workbook.modified = new Date()

  // Add a summary sheet
  const summarySheet = workbook.addWorksheet("Summary")

  // Add title
  summarySheet.mergeCells("A1:F1")
  const titleCell = summarySheet.getCell("A1")
  titleCell.value = "EXPENSE REPORT"
  titleCell.font = { size: 16, bold: true }
  titleCell.alignment = { horizontal: "center" }

  // Add date range
  summarySheet.mergeCells("A2:F2")
  const dateRangeCell = summarySheet.getCell("A2")
  dateRangeCell.value = `From ${format(dateRange.from, "dd/MM/yyyy")} to ${format(dateRange.to, "dd/MM/yyyy")}`
  dateRangeCell.alignment = { horizontal: "center" }

  // Add summary data
  summarySheet.addRow([])
  summarySheet.addRow(["Summary", "", "", "", "", ""])

  const totalExpense = filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  const totalIncome = filteredTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpense

  summarySheet.addRow(["Total Expenses:", totalExpense.toLocaleString("vi-VN") + " VND", "", "", "", ""])

  summarySheet.addRow(["Total Income:", totalIncome.toLocaleString("vi-VN") + " VND", "", "", "", ""])

  summarySheet.addRow(["Balance:", balance.toLocaleString("vi-VN") + " VND", "", "", "", ""])

  // Add category breakdown
  summarySheet.addRow([])
  summarySheet.addRow(["Expenses by Category", "", "", "", "", ""])

  // Group expenses by category
  const expensesByCategory = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce(
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

  // Add category breakdown rows
  Object.entries(expensesByCategory).forEach(([categoryId, amount]) => {
    const category = categories.find((c) => c.id === categoryId)
    summarySheet.addRow([
      category?.name || "Other",
      amount.toLocaleString("vi-VN") + " VND",
      `${((amount / totalExpense) * 100).toFixed(2)}%`,
      "",
      "",
      "",
    ])
  })

  // Add transactions sheet
  const transactionsSheet = workbook.addWorksheet("Transactions")

  // Add headers
  transactionsSheet.columns = [
    { header: "Date", key: "date", width: 15 },
    { header: "Type", key: "type", width: 15 },
    { header: "Category", key: "category", width: 20 },
    { header: "Description", key: "description", width: 30 },
    { header: "Amount", key: "amount", width: 20 },
  ]

  // Add transaction rows
  filteredTransactions.forEach((transaction) => {
    const category = categories.find((c) => c.id === transaction.category)
    transactionsSheet.addRow({
      date: format(transaction.date, "dd/MM/yyyy"),
      type: transaction.type === "expense" ? "Expense" : "Income",
      category: category?.name || "Other",
      description: transaction.description,
      amount: transaction.amount.toLocaleString("vi-VN") + " VND",
    })
  })

  // Style the headers
  const headerRow = transactionsSheet.getRow(1)
  headerRow.font = { bold: true }
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    }
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    }
  })

  // Generate and download the file
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `Expense_Report_${format(dateRange.from, "dd-MM-yyyy")}_to_${format(dateRange.to, "dd-MM-yyyy")}.xlsx`
  a.click()
  window.URL.revokeObjectURL(url)
}
