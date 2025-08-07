'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-blue-900">
                Thorn Bird Books
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/books" className="text-gray-700 hover:text-blue-900 font-medium">
              Books
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-blue-900 font-medium">
              Events
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-900 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-900 font-medium">
              Contact
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search books, authors..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/account" className="text-gray-700 hover:text-blue-900">
              <UserIcon className="h-6 w-6" />
            </Link>
            <Link href="/cart" className="text-gray-700 hover:text-blue-900 relative">
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search books, authors..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              href="/books"
              className="block px-3 py-2 text-gray-700 hover:text-blue-900 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Books
            </Link>
            <Link
              href="/events"
              className="block px-3 py-2 text-gray-700 hover:text-blue-900 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Events
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-gray-700 hover:text-blue-900 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-gray-700 hover:text-blue-900 font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
            <div className="border-t pt-2">
              <Link
                href="/account"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Account
              </Link>
              <Link
                href="/cart"
                className="flex items-center px-3 py-2 text-gray-700 hover:text-blue-900"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCartIcon className="h-5 w-5 mr-2" />
                Cart (0)
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}