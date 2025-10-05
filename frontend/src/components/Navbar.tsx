import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useAuthStore } from '@/store/authStore';
import { Button } from './ui/button';
import { Menu, X, User, LogOut, Calendar, Globe } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const changeLanguage = (locale: string) => {
    router.push(router.pathname, router.asPath, { locale });
  };

  const navLinks = [
    { href: '/', label: t('nav.home') || 'Home' },
    { href: '/doctors', label: t('nav.doctors') || 'Find Doctors' },
    { href: '/specializations', label: t('nav.specializations') || 'Specializations' },
    { href: '/hospitals', label: t('nav.hospitals') || 'Hospitals' },
    { href: '/careers', label: t('nav.careers') || 'Careers' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: t('nav.about') || 'About' },
  ];

  return (
    <nav className="bg-primary text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-xl">S</span>
            </div>
            <span className="font-bold text-xl hidden sm:block">Siloam Hospitals</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`hover:text-accent transition-colors ${
                  router.pathname === link.href ? 'text-accent font-semibold' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <button
              onClick={() => changeLanguage(i18n.language === 'id' ? 'en' : 'id')}
              className="flex items-center space-x-1 hover:text-accent transition-colors"
            >
              <Globe size={18} />
              <span className="text-sm uppercase">{i18n.language === 'id' ? 'EN' : 'ID'}</span>
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center space-x-3">
                <Button asChild variant="outline" size="sm" className="text-primary">
                  <Link href="/appointments">
                    <Calendar size={16} className="mr-2" />
                    {t('nav.myAppointments') || 'My Appointments'}
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm" className="text-white hover:text-accent">
                  <Link href="/profile">
                    <User size={16} className="mr-2" />
                    {user.firstName}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white hover:text-accent"
                >
                  <LogOut size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="ghost" size="sm" className="text-white hover:text-accent">
                  <Link href="/login">{t('nav.login') || 'Login'}</Link>
                </Button>
                <Button asChild variant="secondary" size="sm">
                  <Link href="/register">{t('nav.register') || 'Register'}</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={toggleMenu} className="md:hidden">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`hover:text-accent transition-colors ${
                    router.pathname === link.href ? 'text-accent font-semibold' : ''
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-primary-light">
                {isAuthenticated && user ? (
                  <>
                    <Link
                      href="/profile"
                      className="block py-2 hover:text-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <User size={16} className="inline mr-2" />
                      {user.firstName}
                    </Link>
                    <Link
                      href="/appointments"
                      className="block py-2 hover:text-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <Calendar size={16} className="inline mr-2" />
                      {t('nav.myAppointments') || 'My Appointments'}
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="block py-2 hover:text-accent"
                    >
                      <LogOut size={16} className="inline mr-2" />
                      {t('nav.logout') || 'Logout'}
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block py-2 hover:text-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.login') || 'Login'}
                    </Link>
                    <Link
                      href="/register"
                      className="block py-2 hover:text-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      {t('nav.register') || 'Register'}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
