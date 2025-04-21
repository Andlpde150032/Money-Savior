"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CategoryList } from "@/components/category-list"
import { CategorySkeleton } from "@/components/skeletons/category-skeleton"
import { useLanguage } from "@/lib/language-context"

export default function CategoriesPage() {
  const { t } = useLanguage()

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("categoriesTitle")}</h1>
          <p className="text-muted-foreground">{t("categoriesDescription")}</p>
        </div>
        <Button asChild>
          <Link href="/categories/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("addCategory")}
          </Link>
        </Button>
      </div>

      <Suspense fallback={<CategorySkeleton />}>
        <CategoryList />
      </Suspense>
    </div>
  )
}
