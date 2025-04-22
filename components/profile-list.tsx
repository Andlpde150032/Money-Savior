"use client"

import type React from "react"

import { Check, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import type { Profile } from "@/lib/profile-context"

interface ProfileListProps {
  profiles: Profile[]
  currentProfileId: string
  onSwitchProfile: (profileId: string) => void
  onDeleteProfile: (profileId: string) => void
}

export function ProfileList({ profiles, currentProfileId, onSwitchProfile, onDeleteProfile }: ProfileListProps) {
  const { t } = useLanguage()

  if (profiles.length === 0) {
    return (
      <div className="rounded-md border border-dashed p-6 text-center">
        <p className="text-muted-foreground">{t("noProfiles")}</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label>{t("availableProfiles")}</Label>
      <div className="rounded-md border">
        {profiles.map((profile) => (
          <div key={profile.id} className="flex items-center justify-between border-b p-3 last:border-0">
            <div className="flex items-center gap-2">
              {profile.id === currentProfileId && <Check className="h-4 w-4 text-primary" />}
              <span className={profile.id === currentProfileId ? "font-medium" : ""}>{profile.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {profile.id !== currentProfileId && (
                <Button variant="outline" size="sm" onClick={() => onSwitchProfile(profile.id)}>
                  {t("switchTo")}
                </Button>
              )}
              {profiles.length > 1 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">{t("deleteProfile")}</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t("deleteProfileConfirmation")}</DialogTitle>
                      <DialogDescription>{t("deleteProfileWarning")}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="destructive" onClick={() => onDeleteProfile(profile.id)}>
                        {t("confirmDelete")}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const Label = ({ children }: { children: React.ReactNode }) => <p className="text-sm font-medium">{children}</p>
