'use client'

import { useState } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export default function SearchBar({ onSearch, placeholder = "Search books, authors, categories..." }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query.trim())
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className={`relative flex items-center bg-white rounded-lg border-2 transition-colors ${
          isFocused ? 'border-blue-500' : 'border-gray-300'
        }`}>
          <div className="absolute left-3 text-gray-400">
            <Search size={20} />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 text-lg rounded-lg focus:outline-none"
          />
          
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-12 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          )}
          
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </form>
      
      {/* Search suggestions could go here */}
      {isFocused && query && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-10 mt-1">
          {/* This would be populated with actual search suggestions */}
          <div className="p-4 text-gray-500 text-center">
            Press Enter to search for &ldquo;{query}&rdquo;
          </div>
        </div>
      )}
    </div>
  )
}