import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Database, 
  Layers, 
  BrainCircuit, 
  ArrowRight, 
  Sparkles,
  Code,
  FileText,
  GitBranch
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 h-16 border-b border-border/30 backdrop-blur-xl">
        <div className="container h-full flex items-center justify-between">
          <div className="flex items-center gap-2 font-space font-bold text-xl tracking-wider">
            <Zap className="w-5 h-5 text-primary" />
            PLAY<span className="text-primary text-shadow-neon">ARTS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/hub">
              <Button variant="ghost" className="font-space hover:bg-primary/10 hover:text-primary">
                Hub
              </Button>
            </Link>
            <Button className="font-space bg-primary text-primary-foreground shadow-neon-sm hover:shadow-neon transition-shadow">
              <Sparkles className="w-4 h-4 mr-2" />
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container py-24 lg:py-32">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <Badge variant="outline" className="border-primary/50 text-primary bg-primary/10 font-mono px-4 py-1.5">
            <Sparkles className="w-3 h-3 mr-2" />
            AI Data Infrastructure
          </Badge>
          
          <h1 className="text-5xl lg:text-7xl font-bold font-space tracking-tight">
            Your AI Data
            <span className="block text-primary text-shadow-neon mt-2">Command Center</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Capture, curate, and transform your AI interactions into powerful training datasets. 
            Build the future of personalized AI with PlayArts Hub.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link to="/hub">
              <Button size="lg" className="font-space text-lg px-8 bg-primary text-primary-foreground shadow-neon hover:shadow-[0_0_50px_hsl(var(--primary)/0.5)] transition-all">
                Launch Hub
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="font-space text-lg px-8 border-border/50 hover:border-primary/50 hover:bg-primary/5">
              View Docs
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 container pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="group glass-panel rounded-2xl p-8 hover:border-primary/50 transition-all hover:shadow-neon-sm cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 group-hover:shadow-neon-sm transition-shadow">
              <Database className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-semibold font-space mb-3">Data Lake</h3>
            <p className="text-muted-foreground leading-relaxed">
              Automatically capture and organize code snippets, prompts, and AI outputs from your browser extension.
            </p>
            <div className="flex gap-2 mt-6">
              <Badge variant="secondary" className="text-[10px]">
                <Code className="w-3 h-3 mr-1" />
                Code
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                <FileText className="w-3 h-3 mr-1" />
                Prompts
              </Badge>
            </div>
          </div>

          <div className="group glass-panel rounded-2xl p-8 hover:border-accent/50 transition-all hover:shadow-neon-accent cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center mb-6 group-hover:shadow-neon-accent transition-shadow">
              <Layers className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-semibold font-space mb-3">Dataset Studio</h3>
            <p className="text-muted-foreground leading-relaxed">
              Transform raw data into structured training datasets with powerful preprocessing and formatting tools.
            </p>
            <div className="flex gap-2 mt-6">
              <Badge variant="secondary" className="text-[10px]">
                <GitBranch className="w-3 h-3 mr-1" />
                JSONL
              </Badge>
              <Badge variant="secondary" className="text-[10px]">
                Alpaca
              </Badge>
            </div>
          </div>

          <div className="group glass-panel rounded-2xl p-8 hover:border-neon-pink/50 transition-all cursor-pointer">
            <div className="w-14 h-14 rounded-xl bg-neon-pink/10 border border-neon-pink/30 flex items-center justify-center mb-6">
              <BrainCircuit className="w-7 h-7 text-neon-pink" />
            </div>
            <h3 className="text-xl font-semibold font-space mb-3">Training Pipeline</h3>
            <p className="text-muted-foreground leading-relaxed">
              Fine-tune foundation models with your curated datasets. Coming soon to complete your AI workflow.
            </p>
            <div className="flex gap-2 mt-6">
              <Badge className="bg-neon-pink/20 text-neon-pink border-neon-pink/50 text-[10px]">
                Coming Soon
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 container pb-24">
        <div className="glass-panel rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-4xl font-bold font-space text-primary text-shadow-neon">50K+</div>
              <div className="text-sm text-muted-foreground">Data Points Captured</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold font-space text-accent">1.2M</div>
              <div className="text-sm text-muted-foreground">Tokens Processed</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold font-space text-neon-green">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold font-space text-neon-orange">24/7</div>
              <div className="text-sm text-muted-foreground">Auto-Sync</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border/30 py-8">
        <div className="container flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-space">
            <Zap className="w-4 h-4 text-primary" />
            PlayArts © 2024
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-primary cursor-pointer transition-colors">Docs</span>
            <span className="hover:text-primary cursor-pointer transition-colors">GitHub</span>
            <span className="hover:text-primary cursor-pointer transition-colors">Discord</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
