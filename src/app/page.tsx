'use client'

import { useState, useEffect } from 'react'
import { Book } from '@/types'
import BookCard from '@/components/BookCard'
import SearchBar from '@/components/SearchBar'
import FilterSidebar from '@/components/FilterSidebar'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({})

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '12',
          ...(searchQuery && { search: searchQuery }),
          ...filters,
        })

        const response = await fetch(`/api/books?${params}`)
        const result = await response.json()

        if (result.success) {
          setBooks(result.data.books)
          setTotalPages(result.data.pagination.totalPages)
        }
      } catch (error) {
        console.error('Error fetching books:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [currentPage, searchQuery, filters])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Thorn Bird Books
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Discover your next great read from our curated collection
          </p>
          <SearchBar onSearch={handleSearch} />
        </section>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-1/4">
            <FilterSidebar onFilterChange={handleFilterChange} />
          </aside>

          {/* Books Grid */}
          <section className="lg:w-3/4">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                    <div className="bg-gray-300 h-4 rounded mb-2"></div>
                    <div className="bg-gray-300 h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : books.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {books.map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  No books found
                </h2>
                <p className="text-gray-600">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
