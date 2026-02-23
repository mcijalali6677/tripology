export default function ExploreLoading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="h-16 border-b bg-card" />
      <div className="border-b bg-secondary/10">
        <div className="container mx-auto px-4 py-4">
          <div className="h-10 bg-secondary/30 rounded-xl mb-3" />
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-8 w-24 bg-secondary/30 rounded-full" />
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6">
        <div className="h-8 w-64 bg-secondary/30 rounded-lg mb-6" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl border bg-card overflow-hidden">
              <div className="h-48 bg-secondary/30" />
              <div className="p-4 space-y-2">
                <div className="h-4 w-3/4 bg-secondary/30 rounded" />
                <div className="h-3 w-1/2 bg-secondary/30 rounded" />
                <div className="h-3 w-full bg-secondary/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
