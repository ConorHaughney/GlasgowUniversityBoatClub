'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/committee', label: 'Committee' },
    { href: '/news', label: 'News' },
    { href: '/events', label: 'Events' },
    { href: '/photos', label: 'Photos' },
    { href: '/merch', label: 'Merch' },
    { href: '/achievements', label: 'Our History' },
    { href: '/alumni', label: 'Alumni' },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-black shadow-lg fixed w-full top-0 z-50 border-b-2 border-[#ffdc36]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-16 w-16">
              <Image 
                src="/GUBC_logo.jpg" 
                alt="GUBC Logo" 
                fill
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`uppercase tracking-wider text-sm transition-colors py-2 ${
                  isActive(link.href)
                    ? 'text-[#ffdc36] border-b-2 border-[#ffdc36]'
                    : 'text-white hover:text-[#ffdc36]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-black border-t border-[#ffdc36]">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block py-2 uppercase tracking-wider text-sm ${
                  isActive(link.href)
                    ? 'text-[#ffdc36]'
                    : 'text-white hover:text-[#ffdc36]'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}