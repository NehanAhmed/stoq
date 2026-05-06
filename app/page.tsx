import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  IconScan, 
  IconBrain, 
  IconChefHat, 
  IconShoppingCart,
  IconArrowRight,
  IconCheck,
  IconSparkles,
  IconBrandGithub,
  IconBrandX,
  IconBrandInstagram,
  IconBrandFacebook,
  IconWorld,
  IconMail
} from "@tabler/icons-react"
import Link from "next/link"

export default function Page() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-center border-b border-border bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-6 sm:px-8 lg:px-12">
          <div className="text-lg font-semibold">Stoq</div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com/NehanAhmed/stoq" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub Repository"
            >
              <IconBrandGithub className="h-5 w-5" />
            </a>
            <a 
              href="https://x.com/Nehanahmed988" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="X (Twitter)"
            >
              <IconBrandX className="h-5 w-5" />
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
      {/* Hero Section */}
      <section className="relative px-6 py-24 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            {/* Badge */}
            <Badge className="mb-6 px-4 py-2 text-sm font-medium">
              <IconSparkles className="mr-2 h-4 w-4" />
              AI-Powered Household Management
            </Badge>
            
            {/* Headline */}
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Transform Your Kitchen
              <br />
              <span className="text-primary">With Smart Inventory</span>
            </h1>
            
            {/* Subheadline */}
            <p className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              Scan receipts, manage pantry automatically, and discover recipes you can cook right now. 
              The intelligent kitchen assistant you&apos;ve been waiting for.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" className="px-8 py-3 text-base" asChild>
                <Link href="/login">
                  Get Started Free
                  <IconArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3 text-base" asChild>
                <Link href="#demo">
                  Watch Demo
                  <IconScan className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-6 py-24 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              How Stoq Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to kitchen intelligence
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <Card className="border-border bg-card">
              <CardContent className="p-8 text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <IconScan className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Scan Receipt</h3>
                <p className="text-muted-foreground">
                  Simply snap a photo of your grocery receipt. Our AI extracts every item automatically.
                </p>
              </CardContent>
            </Card>
            
            {/* Step 2 */}
            <Card className="border-border bg-card">
              <CardContent className="p-8 text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <IconBrain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">AI Processing</h3>
                <p className="text-muted-foreground">
                  Review and confirm the extracted items. They're instantly added to your smart pantry.
                </p>
              </CardContent>
            </Card>
            
            {/* Step 3 */}
            <Card className="border-border bg-card">
              <CardContent className="p-8 text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <IconChefHat className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-semibold">Cook Smart</h3>
                <p className="text-muted-foreground">
                  Get recipe suggestions based on what you actually have. Never wonder "what's for dinner" again.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 sm:px-8 lg:px-12 xl:px-16 bg-muted/30">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Smart Kitchen Management
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Stoq automates the tedious parts of kitchen management so you can focus on cooking great meals.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <IconCheck className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h4 className="font-semibold">Automatic Inventory</h4>
                    <p className="text-sm text-muted-foreground">Items are added to your pantry as soon as you shop</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IconCheck className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h4 className="font-semibold">Recipe Intelligence</h4>
                    <p className="text-sm text-muted-foreground">Get suggestions based on ingredients you actually own</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <IconCheck className="mt-1 h-5 w-5 shrink-0 text-primary" />
                  <div>
                    <h4 className="font-semibold">Smart Stock Tracking</h4>
                    <p className="text-sm text-muted-foreground">Know when you're running low before you run out</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="w-full max-w-md rounded-lg bg-card p-8 border border-border">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-success"></div>
                    <span className="text-sm font-medium">Milk</span>
                    <span className="ml-auto text-sm text-muted-foreground">In Stock</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-warning"></div>
                    <span className="text-sm font-medium">Eggs</span>
                    <span className="ml-auto text-sm text-muted-foreground">Low Stock</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-destructive"></div>
                    <span className="text-sm font-medium">Bread</span>
                    <span className="ml-auto text-sm text-muted-foreground">Out of Stock</span>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center">
                      Last updated: 2 hours ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section id="demo" className="px-6 py-24 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            See Stoq in Action
          </h2>
          <p className="mb-12 text-lg text-muted-foreground">
            Watch how easily you can manage your kitchen with intelligent automation
          </p>
          
          <div className="relative aspect-video overflow-hidden rounded-lg border border-border bg-muted">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <IconShoppingCart className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <p className="text-lg font-medium text-foreground">Demo Video Coming Soon</p>
                <p className="text-sm text-muted-foreground mt-2">
                  See how receipt scanning and pantry management work seamlessly
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 sm:px-8 lg:px-12 xl:px-16 bg-muted/30">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Ready to Transform Your Kitchen?
          </h2>
          <p className="mb-10 text-lg text-muted-foreground">
            Join thousands of home cooks who've simplified their kitchen management with Stoq.
          </p>
          <Button size="lg" className="px-8 py-3 text-base" asChild>
            <Link href="/login">
              Get Started Free
              <IconArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center border-t border-border bg-muted/30">
        <div className="container px-6 py-12 sm:px-8 lg:px-12">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Stoq</h3>
              <p className="text-sm text-muted-foreground">
                Transform your kitchen with smart inventory management powered by AI.
              </p>
            </div>
            
            {/* Product */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#demo" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#demo" className="hover:text-foreground transition-colors">Demo</Link></li>
                <li><Link href="/login" className="hover:text-foreground transition-colors">Get Started</Link></li>
              </ul>
            </div>
            
            {/* Connect */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Connect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a 
                    href="https://nehan.vercel.app" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <IconWorld className="h-3 w-3" />
                    Portfolio
                  </a>
                </li>
                <li>
                  <a 
                    href="mailto:contact@stoq.app" 
                    className="hover:text-foreground transition-colors flex items-center gap-1"
                  >
                    <IconMail className="h-3 w-3" />
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Social */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Follow</h4>
              <div className="flex gap-3">
                <a 
                  href="https://instagram.com/__nehanahmed" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <IconBrandInstagram className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.facebook.com/profile.php?id=61557055856757" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Facebook"
                >
                  <IconBrandFacebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://x.com/Nehanahmed988" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="X (Twitter)"
                >
                  <IconBrandX className="h-5 w-5" />
                </a>
                <a 
                  href="https://github.com/NehanAhmed/stoq" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="GitHub"
                >
                  <IconBrandGithub className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2026 Stoq. Built with ❤️ by <a href="https://nehan.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Nehan Ahmed</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
