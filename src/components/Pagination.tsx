'use client'

import Link from 'next/link'
import cx from 'clsx'

interface PaginationProps {
    currentPage: number
    totalPages: number
    baseUrl?: string
}

export default function Pagination({
    currentPage,
    totalPages,
    baseUrl = '/blog',
}: PaginationProps) {
    // Don't render if there's only one page or no pages
    if (totalPages <= 1) {
        return null
    }

    const getPageUrl = (page: number) => {
        if (page === 1) {
            return baseUrl
        }
        return `${baseUrl}?page=${page}`
    }

    // Calculate which page numbers to show
    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const maxVisible = 5 // Maximum number of page buttons to show

        if (totalPages <= maxVisible) {
            // Show all pages if total is less than max
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Always show first page
            pages.push(1)

            if (currentPage > 3) {
                pages.push('...')
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1)
            const end = Math.min(totalPages - 1, currentPage + 1)

            for (let i = start; i <= end; i++) {
                if (i !== 1 && i !== totalPages) {
                    pages.push(i)
                }
            }

            if (currentPage < totalPages - 2) {
                pages.push('...')
            }

            // Always show last page
            pages.push(totalPages)
        }

        return pages
    }

    const pageNumbers = getPageNumbers()

    return (
        <nav
            aria-labelledby="pagination"
            className="mb-8 mt-12 flex items-center justify-center gap-2"
        >
			<h2 id="pagination" className="sr-only">Blog Pagination</h2>
            {/* Previous Button */}
				<Link
                    rel="prev"
                    href={currentPage === 1 ? '#' : getPageUrl(currentPage - 1)}
                    className={cx(`rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50 focus:outline-2 focus:outline-offset-2 focus:outline-[#0E8168]`, currentPage === 1 && 'cursor-not-allowed text-gray-500')}
                    aria-label={`Go to page ${currentPage - 1}`}
					aria-disabled={currentPage === 1}
                >
                    Previous
                </Link>

            {/* Page Numbers */}
            <div className="flex gap-2">
                {pageNumbers.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-2 py-2 text-gray-500"
                            >
                                ...
                            </span>
                        )
                    }

                    const pageNum = page as number
                    const isCurrentPage = pageNum === currentPage

                    if (isCurrentPage) {
                        return (
                            <Link
								href="#"
                                key={pageNum}
                                className="cursor-default rounded-lg border border-[#0E8168] bg-[#0E8168] px-4 py-2 text-white"
                                aria-label={`Current page, page ${pageNum}`}
                                aria-current="page"
                            >
                                {pageNum}
                            </Link>
                        )
                    }

                    return (
                        <Link
                            key={pageNum}
                            href={getPageUrl(pageNum)}
                            className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50 focus:outline-2 focus:outline-offset-2 focus:outline-[#0E8168]"
                            aria-label={`Go to page ${pageNum}`}
                        >
                            {pageNum}
                        </Link>
                    )
                })}
            </div>

            {/* Next Button */}
				<Link
                    rel="next"
                    href={currentPage < totalPages ? getPageUrl(currentPage + 1) : '#'}
                    className={cx(`rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-50 focus:outline-2 focus:outline-offset-2 focus:outline-[#0E8168]`, currentPage >= totalPages && 'cursor-not-allowed  text-gray-500')}
                    aria-label={`Go to page ${currentPage + 1}`}
                    aria-disabled={currentPage < totalPages}
                >
                    Next
                </Link>
        </nav>
    )
}
