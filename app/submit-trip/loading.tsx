import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-8 animate-spin text-forest" />
        <p className="text-muted-foreground">Loading trip submission...</p>
      </div>
    </div>
  )
}
