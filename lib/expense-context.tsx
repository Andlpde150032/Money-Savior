"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

export type TransactionType = "expense" | "income"
export type CategoryType = "expense" | "income" | "both"

export interface Transaction {
  id: string
  amount: number
  type: TransactionType
  category: string
  date: Date
  description: string
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  type: CategoryType
  icon: string
  color: string
}

interface ExpenseContextType {
  transactions: Transaction[]
  categories: Category[]
  addTransaction: (transaction: Transaction) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  addCategory: (category: Category) => void
  updateCategory: (id: string, category: Partial<Category>) => void
  deleteCategory: (id: string) => void
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined)

const defaultCategories: Category[] = [
  {
    id: "food",
    name: "Ăn uống",
    type: "expense",
    icon: "utensils",
    color: "#ef4444",
  },
  {
    id: "transport",
    name: "Di chuyển",
    type: "expense",
    icon: "bus",
    color: "#f97316",
  },
  {
    id: "shopping",
    name: "Mua sắm",
    type: "expense",
    icon: "shopping-bag",
    color: "#8b5cf6",
  },
  {
    id: "entertainment",
    name: "Giải trí",
    type: "expense",
    icon: "coffee",
    color: "#ec4899",
  },
  {
    id: "utilities",
    name: "Hóa đơn",
    type: "expense",
    icon: "lightbulb",
    color: "#14b8a6",
  },
  {
    id: "health",
    name: "Sức khỏe",
    type: "expense",
    icon: "pill",
    color: "#22c55e",
  },
  {
    id: "salary",
    name: "Lương",
    type: "income",
    icon: "banknote",
    color: "#10b981",
  },
  {
    id: "bonus",
    name: "Thưởng",
    type: "income",
    icon: "gift",
    color: "#6366f1",
  },
  {
    id: "investment",
    name: "Đầu tư",
    type: "income",
    icon: "landmark",
    color: "#0ea5e9",
  },
]

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [categories, setCategories] = useState<Category[]>(defaultCategories)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const storedTransactions = localStorage.getItem("transactions")
      const storedCategories = localStorage.getItem("categories")

      if (storedTransactions) {
        const parsedTransactions = JSON.parse(storedTransactions)
        // Convert string dates back to Date objects
        setTransactions(
          parsedTransactions.map((t: any) => ({
            ...t,
            date: new Date(t.date),
            createdAt: new Date(t.createdAt),
          })),
        )
      }

      if (storedCategories) {
        setCategories(JSON.parse(storedCategories))
      } else {
        // If no categories in localStorage, save the default ones
        localStorage.setItem("categories", JSON.stringify(defaultCategories))
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("transactions", JSON.stringify(transactions))
    } catch (error) {
      console.error("Error saving transactions to localStorage:", error)
    }
  }, [transactions])

  useEffect(() => {
    try {
      localStorage.setItem("categories", JSON.stringify(categories))
    } catch (error) {
      console.error("Error saving categories to localStorage:", error)
    }
  }, [categories])

  const addTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction])
  }

  const updateTransaction = (id: string, transaction: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...transaction } : t)))
  }

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category])
  }

  const updateCategory = (id: string, category: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...category } : c)))
  }

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <ExpenseContext.Provider
      value={{
        transactions,
        categories,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  )
}

export function useExpense() {
  const context = useContext(ExpenseContext)
  if (context === undefined) {
    throw new Error("useExpense must be used within an ExpenseProvider")
  }
  return context
}
