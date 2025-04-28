"use client"

import { useState, useEffect } from "react"
import { Download, FileUp, Plus } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useExpense } from "@/lib/expense-context"
import { useLanguage } from "@/lib/language-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ProfileList } from "@/components/profile-list"
import { useProfile } from "@/lib/profile-context"
import { useIsMobile } from "@/hooks/use-mobile"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function SettingsPage() {
  const { t, language, setLanguage } = useLanguage()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const { transactions, categories } = useExpense()
  const { profiles, currentProfile, createProfile, switchProfile, deleteProfile, exportProfile, importProfile } =
    useProfile()
  const isMobile = useIsMobile()

  const [newProfileName, setNewProfileName] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) {
      toast({
        variant: "destructive",
        title: t("errorOccurred"),
        description: t("profileNameRequired"),
      })
      return
    }

    createProfile(newProfileName)
    setNewProfileName("")
    toast({
      title: t("profileCreated"),
      description: t("profileCreatedSuccess"),
    })
  }

  const handleExportData = async () => {
    try {
      await exportProfile()
      toast({
        title: t("dataExported"),
        description: t("dataExportedSuccess"),
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("errorOccurred"),
        description: t("dataExportFailed"),
      })
    }
  }

  const handleImportData = async () => {
    try {
      await importProfile()
      toast({
        title: t("dataImported"),
        description: t("dataImportedSuccess"),
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("errorOccurred"),
        description: t("dataImportFailed"),
      })
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("settingsTitle")}</h1>
        <p className="text-muted-foreground">{t("settingsDescription")}</p>
      </div>

      <div className="grid gap-6">
        {isMobile && (
          <Card>
            <CardHeader>
              <CardTitle>{t("appearance")}</CardTitle>
              <CardDescription>{t("appearanceDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{t("theme")}</Label>
                <RadioGroup
                  defaultValue={theme}
                  onValueChange={(value) => setTheme(value)}
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="min-w-0">
                    <RadioGroupItem value="light" id="light" className="peer sr-only" />
                    <Label
                      htmlFor="light"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="break-words text-center text-sm">{t("light")}</span>
                    </Label>
                  </div>
                  <div className="min-w-0">
                    <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                    <Label
                      htmlFor="dark"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="break-words text-center text-sm">{t("dark")}</span>
                    </Label>
                  </div>
                  <div className="min-w-0">
                    <RadioGroupItem value="system" id="system" className="peer sr-only" />
                    <Label
                      htmlFor="system"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span className="break-words text-center text-sm">{t("system")}</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label>{t("language")}</Label>
                <RadioGroup
                  defaultValue={language}
                  onValueChange={(value: "en" | "vi") => setLanguage(value)}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <RadioGroupItem value="en" id="en" className="peer sr-only" />
                    <Label
                      htmlFor="en"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span>English</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem value="vi" id="vi" className="peer sr-only" />
                    <Label
                      htmlFor="vi"
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <span>Tiếng Việt</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{t("dataProfiles")}</CardTitle>
            <CardDescription>{t("dataProfilesDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t("currentProfile")}</Label>
              <div className="rounded-md bg-muted p-3">
                <p className="font-medium">{currentProfile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {t("transactionsCount")}: {transactions.length} • {t("categoriesCount")}: {categories.length}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-end gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="profile-name">{t("newProfileName")}</Label>
                  <Input
                    id="profile-name"
                    value={newProfileName}
                    onChange={(e) => setNewProfileName(e.target.value)}
                    placeholder={t("enterProfileName")}
                  />
                </div>
                <Button onClick={handleCreateProfile}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("createProfile")}
                </Button>
              </div>

              <ProfileList
                profiles={profiles}
                currentProfileId={currentProfile.id}
                onSwitchProfile={switchProfile}
                onDeleteProfile={deleteProfile}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("dataManagement")}</CardTitle>
            <CardDescription>{t("dataManagementDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTitle>{t("dataBackupRecommendation")}</AlertTitle>
              <AlertDescription>{t("dataBackupDescription")}</AlertDescription>
            </Alert>

            <div className="flex flex-wrap gap-4">
              <Button onClick={handleExportData}>
                <Download className="mr-2 h-4 w-4" />
                {t("exportData")}
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <FileUp className="mr-2 h-4 w-4" />
                    {t("importData")}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t("importDataConfirmation")}</DialogTitle>
                    <DialogDescription>{t("importDataWarning")}</DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleImportData}>
                      {t("proceedWithImport")}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
