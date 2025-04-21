"use client"

import Link from "next/link"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useExpense } from "@/lib/expense-context"
import { CategoryIcon } from "@/components/category-icon"
import { useToast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/language-context"

export function CategoryList() {
  const { toast } = useToast()
  const { categories, deleteCategory } = useExpense()
  const { t } = useLanguage()

  const handleDelete = (id: string) => {
    deleteCategory(id)
    toast({
      title: t("categoryDeleted"),
      description: t("categoryDeletedSuccess"),
    })
  }

  if (categories.length === 0) {
    return (
      <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold">{t("noCategories")}</h3>
        <p className="text-muted-foreground">{t("startAddingCategories")}</p>
        <Button className="mt-4" asChild>
          <Link href="/categories/new">{t("addFirstCategory")}</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <div key={category.id} className="flex items-center gap-4 rounded-lg border p-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <CategoryIcon name={category.icon} className="h-5 w-5" style={{ color: category.color }} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{category.name}</h3>
            <p className="text-sm text-muted-foreground">
              {category.type === "expense" ? t("expense") : category.type === "income" ? t("income") : t("both")}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">{t("options")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/categories/${category.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  {t("edit")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => handleDelete(category.id)}
              >
                <Trash className="mr-2 h-4 w-4" />
                {t("delete")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ))}
    </div>
  )
}
