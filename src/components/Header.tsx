'use client'

import Link from 'next/link'
import { ShoppingCart, User, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isLoggedIn = false // This would come from auth context
  const cartItems = 0 // This would come from cart context

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-blue-600">
              Thorn Bird Books
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link href="/books" className="text-gray-700 hover:text-blue-600 transition-colors">
              Books
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-blue-600 transition-colors">
              Categories
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Search button for mobile */}
            <button className="md:hidden p-2 text-gray-700 hover:text-blue-600">
              <Search size={20} />
            </button>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-700 hover:text-blue-600">
              <ShoppingCart size={20} />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </Link>

            {/* User account */}
            {isLoggedIn ? (
              <div className="relative">
                <button className="p-2 text-gray-700 hover:text-blue-600">
                  <User size={20} />
                </button>
                {/* Dropdown menu would go here */}
              </div>
            ) : (
              <div className="hidden md:flex space-x-2">
                <Link 
                  href="/login" 
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/books" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Books
              </Link>
              <Link 
                href="/categories" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link 
                href="/about" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {!isLoggedIn && (
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Link 
                    href="/login" 
                    className="px-4 py-2 text-center text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register" 
                    className="px-4 py-2 text-center bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}