export const metadata = {
  title: "Modules",
  description: "Learning modules for Auburn University Club",
}

export default function ModulesPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-8">
        <h1 className="text-balance bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-6xl md:text-8xl tracking-tight">
          Coming Soon
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
          Learning modules are under development. Check back soon!
        </p>
        <button className="group/btn relative rounded-full bg-primary px-8 py-3 text-primary-foreground transition-all duration-[120ms] ease-out hover:scale-105 hover:shadow-lg active:scale-95">
          <span className="relative z-10 font-semibold">Go Home</span>
          <span className="absolute inset-0 rounded-full bg-primary/20 blur-xl opacity-0 transition-opacity duration-[300ms] ease-out group-hover/btn:opacity-100" />
        </button>
      </div>
    </main>
  )
}
