import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Link from 'next/link';
// import logo from "@/assets/logo.png";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* <img src={logo} alt="Task Management Logo" className="h-10 w-10" /> */}
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Task Management
            </span>
          </div>

          <Menu className="h-6 w-6 md:hidden cursor-pointer hover:text-primary transition-colors" />

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a
              href="#benefits"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Benefits
            </a>
            <a
              href="#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <Link href="/login">
              <Button variant="default" size="default">
                Sign In
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
