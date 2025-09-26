import { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Camera,
    Home,
    Menu,
    MoreHorizontal,
    Settings,
    Users
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';

const navigation = [
  { name: 'Gallery', href: '/', icon: Home, primary: true },
  { name: 'Persons', href: '/persons', icon: Users, primary: true },
  { name: 'Admin', href: '/admin', icon: Settings, primary: false },
];

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  const primaryNavItems = navigation.filter(item => item.primary);
  const secondaryNavItems = navigation.filter(item => !item.primary);

  const NavItem = ({ item, mobile = false }: { item: typeof navigation[0], mobile?: boolean }) => {
    const active = isActive(item.href);
    const Icon = item.icon;
    
    return (
      <Link
        to={item.href}
        className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 group ${
          active
            ? 'bg-primary text-primary-foreground shadow-sm'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        } ${mobile ? 'w-full px-4 py-3' : ''}`}
      >
        <Icon className="w-4 h-4" aria-hidden="true" />
        <span className="text-sm font-medium">{item.name}</span>
        {active && !mobile && (
          <div className="absolute inset-0 rounded-lg bg-primary/10 animate-pulse" />
        )}
      </Link>
    );
  };

  return (
    <div className="bg-card border border-border/20 rounded-xl px-6 py-3 shadow-lg">
      <div className="flex items-center justify-between space-x-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="h-10 w-32 flex items-center justify-start group">
            <div className="max-h-full max-w-full object-contain object-left transition-transform group-hover:scale-105 flex items-center space-x-2">
              <Camera className="w-8 h-8 text-primary" />
              <div className="text-lg font-bold text-foreground">FaceGallery</div>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex items-center space-x-1">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </div>

        {/* Mobile Navigation */}
        <div className="flex xl:hidden items-center space-x-1">
          {/* Very Small Mobile - Hamburger Menu */}
          <div className="flex sm:hidden">
            <DropdownMenu open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                variant={'outline'}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                >
                  <Menu className="w-5 h-5" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="w-48 bg-card/95 backdrop-blur-xl border border-border rounded-xl mt-2 shadow-xl"
              >
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <DropdownMenuItem key={item.name} asChild>
                      <Link
                        to={item.href}
                        className={`flex items-center space-x-3 w-full px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                          active 
                            ? 'text-primary bg-primary/10' 
                            : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4" aria-hidden="true" />
                        <span>{item.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Small Mobile and up - Show primary items + More dropdown */}
          <div className="hidden sm:flex items-center space-x-1">
            {/* Primary items always visible */}
            {primaryNavItems.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
            
            {/* More dropdown for secondary items */}
            {secondaryNavItems.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                  variant={'outline'}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                  >
                    <MoreHorizontal className="w-4 h-4" aria-hidden="true" />
                    <span className="text-sm font-medium">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-48 bg-card/95 backdrop-blur-xl border border-border rounded-xl mt-2 shadow-xl"
                >
                  {secondaryNavItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    return (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link
                          to={item.href}
                          className={`flex items-center space-x-3 w-full px-4 py-3 text-sm rounded-lg transition-all duration-200 ${
                            active 
                              ? 'text-primary bg-primary/10' 
                              : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                          }`}
                        >
                          <Icon className="w-4 h-4" aria-hidden="true" />
                          <span>{item.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}