"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useExpense } from "@/lib/expense-context"
import { CategoryIcon } from "@/components/category-icon"
import { useLanguage } from "@/lib/language-context"
import { TransactionSkeleton } from "@/components/skeletons/transaction-skeleton"
import { CalendarWrapper } from "@/components/ui/calendar-wrapper"
import { TimePicker } from "@/components/ui/time-picker"

const formSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  type: z.enum(["expense", "income"]),
  category: z.string().min(1, "Please select a category"),
  date: z.date(),
  time: z.string().optional(),
  description: z.string().min(1, "Please enter a description"),
})

export default function EditTransactionPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const { transactions, categories, updateTransaction } = useExpense()
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const id = params.id as string

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      type: "expense",
      category: "",
      date: new Date(),
      time: format(new Date(), "HH:mm"),
      description: "",
    },
  })

  // Load transaction data
  useEffect(() => {
    const transaction = transactions.find((t) => t.id === id)

    if (transaction) {
      // Ensure we're working with a proper Date object
      const transactionDate = transaction.date instanceof Date ? transaction.date : new Date(transaction.date)

      // Get time from transaction or default to current time
      const transactionTime = transaction.time || format(new Date(), "HH:mm")

      form.reset({
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: transactionDate,
        time: transactionTime,
        description: transaction.description,
      })
      setIsLoading(false)
    } else {
      setNotFound(true)
      setIsLoading(false)
    }
  }, [id, transactions, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      updateTransaction(id, values)

      toast({
        title: t("transactionUpdated"),
        description: t("transactionUpdatedSuccess"),
      })

      router.push("/transactions")
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("errorOccurred"),
        description: t("cannotUpdateTransaction"),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const transactionType = form.watch("type")
  const filteredCategories = categories.filter(
    (category) => category.type === transactionType || category.type === "both",
  )

  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{t("editTransaction")}</h1>
          <p className="text-muted-foreground">{t("editTransactionDescription")}</p>
        </div>
        <TransactionSkeleton />
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{t("transactionNotFound")}</h1>
          <p className="text-muted-foreground">{t("transactionNotFoundDescription")}</p>
        </div>
        <Button onClick={() => router.push("/transactions")}>{t("backToTransactions")}</Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("editTransaction")}</h1>
        <p className="text-muted-foreground">{t("editTransactionDescription")}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("transactionType")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectTransactionType")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="expense">{t("expense")}</SelectItem>
                    <SelectItem value="income">{t("income")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("amount")}</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      className="pl-12"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center px-3 text-muted-foreground">VND</div>
                  </div>
                </FormControl>
                <FormDescription>{t("amountDescription")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("category")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCategory")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center">
                          <CategoryIcon
                            name={category.icon}
                            className="mr-2 h-4 w-4"
                            style={{ color: category.color }}
                          />
                          <span>{category.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("transactionDate")}</FormLabel>
                  <FormControl>
                    <CalendarWrapper
                      value={field.value}
                      onChange={(date) => date && field.onChange(date)}
                      placeholder={t("pickDate")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("transactionTime")}</FormLabel>
                  <FormControl>
                    <TimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder={t("pickTime")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("description")}</FormLabel>
                <FormControl>
                  <Textarea placeholder={t("descriptionPlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4">
            <Button type="button" variant="outline" className="w-full" onClick={() => router.back()}>
              {t("cancel")}
            </Button>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t("saving") : t("saveTransaction")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
