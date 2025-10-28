import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import heroImage from '@/assets/hero-illustration.png';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />

      {/* Animated glow orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary">
                The Future of Task Management
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Manage Tasks
              <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Effortlessly
              </span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg">
              Transform the way your team collaborates. Organize, prioritize,
              and complete tasks with an intuitive platform designed for modern
              teams.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="group">
                  Join Us
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg">Dashboard</Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-8 pt-8 border-t border-border">
              <div>
                <div className="text-3xl font-bold text-foreground">10k+</div>
                <div className="text-sm text-muted-foreground">
                  Active Users
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">99%</div>
                <div className="text-sm text-muted-foreground">
                  Satisfaction
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-foreground">4.9</div>
                <div className="text-sm text-muted-foreground">Rating</div>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="relative animate-slide-in-right">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-2xl" />
            <img
              src={heroImage.src}
              alt="Task Management Dashboard"
              className="relative rounded-3xl shadow-2xl border border-border animate-float"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
