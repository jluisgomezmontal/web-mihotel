import { Sparkles } from "lucide-react"

interface HeroSectionProps {
  userName: string
  tenantName: string
}

export function HeroSection({ userName, tenantName }: HeroSectionProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Buenos días"
    if (hour < 19) return "Buenas tardes"
    return "Buenas noches"
  }

  const currentDate = new Date().toLocaleDateString('es-ES', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  return (
    <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-border/50">
      <div className="grid lg:grid-cols-2 min-h-[400px]">
        {/* Left Content - Gradient Background */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/80 dark:from-primary dark:via-primary/90 dark:to-primary/80">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-grid-white/10 dark:bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)]" />
          
          {/* Decorative Blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 dark:bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 dark:bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          
          {/* Content */}
          <div className="relative px-6 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16 h-full flex flex-col justify-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 dark:bg-white/20 backdrop-blur-sm border border-white/30 dark:border-white/30">
                <Sparkles className="h-4 w-4 text-white dark:text-white animate-pulse" />
                <span className="text-xs font-semibold text-white dark:text-white uppercase tracking-wide">
                  Panel de Control
                </span>
              </div>
              
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white dark:text-white tracking-tight leading-tight">
                  {getGreeting()} <br className="hidden sm:block" />
                </h1>
                <p className="text-lg sm:text-xl lg:text-2xl text-white/90 dark:text-white/90 font-medium">
                  Bienvenido a {tenantName}
                </p>
              </div>
              
              <div className="flex items-center gap-2 text-white/80 dark:text-white/80">
                <div className="h-1 w-1 rounded-full bg-white/60 dark:bg-white/60" />
                <p className="text-sm sm:text-base capitalize">
                  {currentDate}
                </p>
              </div>

              {/* Floating Stats */}
              <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 dark:bg-white/10 backdrop-blur-sm border border-white/20 dark:border-white/20">
                <div className="w-2 h-2 rounded-full bg-green-400 dark:bg-green-400 animate-pulse" />
                <span className="text-sm font-semibold text-white dark:text-white">Sistema Activo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Image - Full Height */}
        <div className="relative overflow-hidden bg-muted hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1529316275402-0462fcc4abd6?w=1200&auto=format&fit=crop&q=80"
            alt="Hotel Lobby"
            className="w-full h-full object-cover"
          />
          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-primary/10 dark:to-primary/20" />
        </div>
      </div>
    </div>
  )
}
