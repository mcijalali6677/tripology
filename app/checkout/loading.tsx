export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 border-b" />
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-secondary/30 rounded-lg" />
          <div className="h-32 bg-secondary/30 rounded-xl" />
          <div className="h-48 bg-secondary/30 rounded-xl" />
          <div className="h-12 bg-secondary/30 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
