"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useExpense } from "@/lib/expense-context"
import { useLanguage } from "@/lib/language-context"
import { SimpleCategoryIconPicker } from "@/components/simple-category-icon-picker"
import { SimpleColorPicker } from "@/components/simple-color-picker"

const formSchema = z.object({
  name: z.string().min(1, "Category name is required"),
  type: z.enum(["expense", "income", "both"]),
  icon: z.string().min(1, "Please select an icon"),
  color: z.string().min(1, "Please select a color"),
})

export default function NewCategoryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { addCategory } = useExpense()
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "expense",
      icon: "shopping-bag",
      color: "#ef4444",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      addCategory({
        id: crypto.randomUUID(),
        ...values,
      })

      toast({
        title: t("categoryCreated"),
        description: t("categorySavedSuccess"),
      })

      router.push("/categories")
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("errorOccurred"),
        description: t("cannotCreateCategory"),
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">{t("newCategory")}</h1>
        <p className="text-muted-foreground">{t("newCategoryDescription")}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("categoryName")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("categoryNamePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("categoryType")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCategoryType")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="expense">{t("expense")}</SelectItem>
                    <SelectItem value="income">{t("income")}</SelectItem>
                    <SelectItem value="both">{t("both")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("categoryIcon")}</FormLabel>
                <FormControl>
                  <SimpleCategoryIconPicker value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("categoryColor")}</FormLabel>
                <FormControl>
                  <SimpleColorPicker value={field.value} onChange={field.onChange} />
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
              {isSubmitting ? t("saving") : t("saveCategory")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
