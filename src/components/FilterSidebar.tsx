'use client'

import { useState } from 'react'
import { Filter, ChevronDown, ChevronUp } from 'lucide-react'

interface FilterSidebarProps {
  onFilterChange: (filters: Record<string, unknown>) => void
}

export default function FilterSidebar({ onFilterChange }: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    category: '',
    author: '',
    minPrice: '',
    maxPrice: '',
    format: '',
    language: '',
    inStock: false,
    rating: '',
  })

  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    format: true,
    other: false,
  })

  const categories = [
    'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Science Fiction',
    'Fantasy', 'Biography', 'History', 'Self-Help', 'Business'
  ]

  const formats = ['HARDCOVER', 'PAPERBACK', 'EBOOK']
  const languages = ['English', 'Spanish', 'French', 'German', 'Italian']

  const handleFilterChange = (key: string, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Remove empty filters
    const cleanFilters = Object.entries(newFilters).reduce((acc, [k, v]) => {
      if (v !== '' && v !== false && v !== null && v !== undefined) {
        acc[k] = v
      }
      return acc
    }, {} as Record<string, unknown>)
    
    onFilterChange(cleanFilters)
  }

  const clearFilters = () => {
    const emptyFilters = {
      category: '',
      author: '',
      minPrice: '',
      maxPrice: '',
      format: '',
      language: '',
      inStock: false,
      rating: '',
    }
    setFilters(emptyFilters)
    onFilterChange({})
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Mobile toggle */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 text-left"
        >
          <span className="flex items-center">
            <Filter size={20} className="mr-2" />
            Filters
          </span>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {/* Filter content */}
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block p-4`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filters</h3>
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear All
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h4 className="font-medium">Category</h4>
            {expandedSections.category ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {expandedSections.category && (
            <div className="space-y-2">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h4 className="font-medium">Price Range</h4>
            {expandedSections.price ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {expandedSections.price && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Format Filter */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('format')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h4 className="font-medium">Format</h4>
            {expandedSections.format ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {expandedSections.format && (
            <div className="space-y-2">
              {formats.map(format => (
                <label key={format} className="flex items-center">
                  <input
                    type="radio"
                    name="format"
                    value={format}
                    checked={filters.format === format}
                    onChange={(e) => handleFilterChange('format', e.target.value)}
                    className="mr-2"
                  />
                  <span className="capitalize">{format.toLowerCase()}</span>
                </label>
              ))}
              <label className="flex items-center">
                <input
                  type="radio"
                  name="format"
                  value=""
                  checked={filters.format === ''}
                  onChange={(e) => handleFilterChange('format', e.target.value)}
                  className="mr-2"
                />
                <span>All Formats</span>
              </label>
            </div>
          )}
        </div>

        {/* Other Filters */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('other')}
            className="flex items-center justify-between w-full text-left mb-3"
          >
            <h4 className="font-medium">Other</h4>
            {expandedSections.other ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          {expandedSections.other && (
            <div className="space-y-3">
              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">Language</label>
                <select
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Languages</option>
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>

              {/* In Stock Filter */}
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                  className="mr-2"
                />
                <span>In Stock Only</span>
              </label>

              {/* Author Filter */}
              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <input
                  type="text"
                  placeholder="Search by author"
                  value={filters.author}
                  onChange={(e) => handleFilterChange('author', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}