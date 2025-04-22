"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useExpense } from "@/lib/expense-context"
import { CategoryIcon } from "@/components/category-icon"
import { useLanguage } from "@/lib/language-context"
import { CalendarWrapper } from "@/components/ui/calendar-wrapper"

const formSchema = z.object({
  amount: z.coerce
    .number()
    .min(1000, "Amount must be at least 1000")
    .refine((val) => Number.isInteger(val), "Amount must be a whole number"),
  type: z.enum(["expense", "income"]),
  category: z.string().min(1, "Please select a category"),
  date: z.date(),
  description: z.string().min(1, "Please enter a description"),
})

export default function NewTransactionPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { categories, addTransaction } = useExpense()
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
      type: "expense",
      category: "",
      date: new Date(),
      description: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      addTransaction({
        id: crypto.randomUUID(),
        ...values,
        createdAt: new Date(),
      })

      toast({
        title: t("transactionCreated"),
        description: t("transactionSavedSuccess"),
      })

      router.push("/transactions")
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("errorOccurred"),
        description: t("cannotCreateTransaction"),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const transactionType = form.watch("type")
  const filteredCategories = categories.filter(
    (category) => category.type === transactionType || category.type === "both",
  )

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("newTransaction")}</h1>
        <p className="text-muted-foreground">{t("newTransactionDescription")}</p>
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
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        field.onChange(value ? parseInt(value, 10) : 0);
                      }}
                      className="pr-12"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground">VND</div>
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
