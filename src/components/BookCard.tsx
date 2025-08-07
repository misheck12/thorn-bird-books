'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Book } from '@/types'
import { Star, ShoppingCart, Heart } from 'lucide-react'

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true)
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: book.id,
          quantity: 1,
        }),
      })

      if (response.ok) {
        // Show success message or update cart state
        console.log('Added to cart successfully')
      } else {
        // Handle error
        console.error('Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    // Here you would typically call an API to update the wishlist
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
      )
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star size={16} className="text-gray-300" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      )
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} size={16} className="text-gray-300" />
      )
    }

    return stars
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Book Image */}
      <div className="relative aspect-[3/4] bg-gray-100">
        <Link href={`/books/${book.id}`}>
          {!imageError && book.imageUrl ? (
            <Image
              src={book.imageUrl}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
              <div className="text-center p-4">
                <div className="text-4xl mb-2">📚</div>
                <div className="text-sm text-gray-600 font-medium">{book.title}</div>
              </div>
            </div>
          )}
        </Link>

        {/* Wishlist button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
        >
          <Heart 
            size={20} 
            className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'} 
          />
        </button>

        {/* Stock status */}
        {book.stockQuantity === 0 && (
          <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
            Out of Stock
          </div>
        )}

        {/* Format badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          {book.format.toLowerCase()}
        </div>
      </div>

      {/* Book Details */}
      <div className="p-4">
        <Link href={`/books/${book.id}`}>
          <h3 className="font-semibold text-lg mb-1 line-clamp-2 hover:text-blue-600 transition-colors">
            {book.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-2">{book.author}</p>
        
        <div className="text-sm text-gray-500 mb-2">{book.category}</div>

        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {renderStars(book.rating)}
          </div>
          <span className="ml-2 text-sm text-gray-600">
            {book.rating.toFixed(1)} ({book.reviewCount} reviews)
          </span>
        </div>

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-green-600">
            {formatPrice(book.price)}
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={book.stockQuantity === 0 || isAddingToCart}
            className={`
              flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${book.stockQuantity === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            `}
          >
            <ShoppingCart size={16} className="mr-1" />
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>

        {/* Quick info */}
        <div className="mt-3 text-xs text-gray-500 grid grid-cols-2 gap-2">
          <div>Publisher: {book.publisher}</div>
          <div>Language: {book.language}</div>
        </div>
      </div>
    </div>
  )
}