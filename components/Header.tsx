
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { showToast } from './Toast';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { session, profile, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const portalHref = profile?.role === 'admin' ? '/admin' : '/membership/dashboard';

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await signOut();
    showToast('Logged out.', 'success');
    navigate('/');
  };

  // Handle scrolling to hash anchors. Retries for a bit because the target
  // page is usually still downloading its lazy chunk (Suspense/PageSkeleton
  // is showing) when this effect first fires, so the element doesn't exist yet.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace('#', '');
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 40; // ~2s at 50ms intervals

    const tryScroll = () => {
      if (cancelled) return;
      const element = document.getElementById(id);
      if (element) {
        const yOffset = -80; // Account for sticky header
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
        return;
      }
      attempts += 1;
      if (attempts < maxAttempts) {
        timeoutId = setTimeout(tryScroll, 50);
      }
    };

    let timeoutId = setTimeout(tryScroll, 50);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [location]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#0c0f12]/95 backdrop-blur-md border-b border-[#f0f2f4] dark:border-white/10 px-3 md:px-6 lg:px-10 xl:px-20 py-2 md:py-3 shadow-sm">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-bold"
      >
        Skip to main content
      </a>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="h-10 md:h-12 transition-transform">
              <img src="/images/gpaa_logo.png" alt="GPAA Logo" className="h-full w-auto object-contain" />
            </div>
            <div className="hidden sm:block">
              <h3 className="text-[#111418] dark:text-white text-base md:text-lg lg:text-xl font-black leading-tight tracking-tight">GPAA</h3>
              <p className="text-[11px] md:text-[13px] text-[#617289] dark:text-gray-400 font-bold -mt-0.5">Ghana Physician Assistants Association</p>
            </div>
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-2 md:gap-3 lg:gap-6">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6 animate-in fade-in slide-in-from-left duration-300">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href || location.pathname.startsWith(link.href + '/');
              return (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.submenu && setOpenDropdown(link.label)}
                onMouseLeave={() => setOpenDropdown(null)}
                onFocus={() => link.submenu && setOpenDropdown(link.label)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    setOpenDropdown(null);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setOpenDropdown(null);
                }}
              >
                <Link
                  to={link.href}
                  aria-haspopup={link.submenu ? 'true' : undefined}
                  aria-expanded={link.submenu ? openDropdown === link.label : undefined}
                  aria-current={isActive ? 'page' : undefined}
                  className={`text-xs xl:text-sm font-semibold transition-colors hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 rounded flex items-center gap-1 border-b-2 ${
                    isActive
                      ? 'text-primary border-primary'
                      : 'text-[#111418] dark:text-gray-200 border-transparent'
                  }`}
                >
                  {link.label}
                  {link.submenu && (
                    <span className="material-symbols-outlined text-base">expand_more</span>
                  )}
                </Link>

                {/* Dropdown Menu */}
                {link.submenu && openDropdown === link.label && (
                  <div className="absolute top-full left-0 pt-2 z-50">
                    <div className="bg-white dark:bg-[#14181c] rounded-xl shadow-2xl border border-[#e5e7eb] dark:border-white/10 py-2 min-w-55">
                      {link.submenu.map((sublink) => (
                        <Link
                          key={sublink.label}
                          to={sublink.href}
                          onClick={() => setOpenDropdown(null)}
                          className="block px-4 py-3 text-sm font-semibold text-[#111418] dark:text-gray-200 hover:bg-primary/5 dark:hover:bg-white/5 hover:text-primary focus-visible:bg-primary/5 focus-visible:text-primary transition-colors"
                        >
                          {sublink.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              );
            })}
          </nav>

          <ThemeToggle className="hidden md:inline-flex" />

          {session ? (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to={portalHref}
                className="flex items-center gap-2 cursor-pointer justify-center rounded-xl h-9 lg:h-10 px-4 lg:px-6 border-2 border-primary text-primary text-xs lg:text-sm font-bold hover:bg-primary/5 dark:hover:bg-primary/10 transition-all"
              >
                <span className="material-symbols-outlined text-lg">account_circle</span>
                <span>{profile?.role === 'admin' ? 'Admin' : 'My Portal'}</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 cursor-pointer justify-center rounded-xl h-9 lg:h-10 px-3 lg:px-4 text-[#617289] dark:text-gray-400 text-xs lg:text-sm font-bold hover:text-primary transition-all"
              >
                <span className="material-symbols-outlined text-lg">logout</span>
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-2 cursor-pointer justify-center rounded-xl h-9 lg:h-10 px-4 lg:px-6 border-2 border-primary text-primary text-xs lg:text-sm font-bold hover:bg-primary/5 dark:hover:bg-primary/10 transition-all"
            >
              <span className="material-symbols-outlined text-lg">account_circle</span>
              <span>Member Portal</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-[#111418] dark:text-gray-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-18 bg-white dark:bg-[#0c0f12] border-b dark:border-white/10 shadow-xl p-4 max-h-[calc(100vh-72px)] overflow-y-auto animate-in slide-in-from-top duration-300">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.href || location.pathname.startsWith(link.href + '/');
            return (
            <div key={link.label}>
              <Link
                to={link.href}
                onClick={() => !link.submenu && setMobileMenuOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={`block text-base font-bold p-3 rounded-lg mb-2 ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-[#111418] dark:text-gray-200 hover:bg-background-light dark:hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
              {link.submenu && (
                <div className="ml-4 mb-2 space-y-1">
                  {link.submenu.map((sublink) => (
                    <Link
                      key={sublink.label}
                      to={sublink.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-sm font-semibold p-2 pl-4 rounded-lg text-[#617289] dark:text-gray-400 hover:bg-primary/5 dark:hover:bg-white/5 hover:text-primary"
                    >
                      {sublink.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            );
          })}
          <div className="pt-4 border-t border-[#e5e7eb] dark:border-white/10 mt-4 space-y-3">
            <div className="flex items-center justify-center">
              <ThemeToggle />
              <span className="text-sm font-semibold text-[#617289] dark:text-gray-400 ml-2">Toggle theme</span>
            </div>
            {session ? (
              <>
                <Link
                  to={portalHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-white dark:bg-transparent border-2 border-primary text-primary font-bold py-3 rounded-xl"
                >
                  <span className="material-symbols-outlined">account_circle</span>
                  {profile?.role === 'admin' ? 'Admin' : 'My Portal'}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full text-[#617289] dark:text-gray-400 font-bold py-3 rounded-xl"
                >
                  <span className="material-symbols-outlined">logout</span>
                  Log Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-white dark:bg-transparent border-2 border-primary text-primary font-bold py-3 rounded-xl"
              >
                <span className="material-symbols-outlined">account_circle</span>
                Member Portal
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
