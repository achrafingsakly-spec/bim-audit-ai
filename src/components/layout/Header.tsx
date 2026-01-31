import { useTranslation } from 'react-i18next';
import { Moon, Sun, Globe, Bell, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import logo from '@/assets/logo.png';

const navItems = [
  { key: 'dashboard', path: '/' },
  { key: 'audits', path: '/audit' },
  { key: 'models', path: '/models' },
];

export function Header() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { theme, toggleTheme, language, setLanguage } = useAppStore();

  const handleLanguageChange = (lang: 'fr' | 'en') => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-card sticky top-0 z-50 px-6 py-3"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white p-1.5 shadow-sm">
              <img src={logo} alt="BIM Engineering" className="h-10 w-auto" />
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold text-foreground">
                BIM Audit <span className="gradient-text">Intelligence</span>
              </h1>
              <p className="text-xs text-muted-foreground">Pro Edition</p>
            </div>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.key} to={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`transition-colors ${
                    isActive 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }`}
                >
                  {t(`nav.${item.key}`)}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Globe className="h-5 w-5" />
                <span className="absolute -bottom-1 -right-1 text-[10px] font-semibold uppercase">
                  {language}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card">
              <DropdownMenuItem onClick={() => handleLanguageChange('fr')}>
                🇫🇷 Français
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                🇬🇧 English
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="relative overflow-hidden"
          >
            <motion.div
              initial={false}
              animate={{ rotate: theme === 'dark' ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </motion.div>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>

          {/* User */}
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
