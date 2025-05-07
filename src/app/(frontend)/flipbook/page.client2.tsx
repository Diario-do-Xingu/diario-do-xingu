'use client'

import { cn } from '@/utilities/ui'
// src/components/Flipbook.jsx
import React, { useState, useRef, useEffect } from 'react'

export const Flipbook = ({ pdfUrl }: { pdfUrl: string }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const bookRef = useRef(null)

  // Decide whether to use PDF or images

  // Function to load PDF
  const loadPdf = async (url: string) => {
    if (typeof window === 'undefined') {
      return null // Server-side rendering check
    }

    try {
      const pdfjsLib = await import('pdfjs-dist')
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        '//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.8.69/pdf.worker.min.mjs' // Ensure worker is accessible
      const pdf = await pdfjsLib.getDocument(url).promise

      return pdf
    } catch (error) {
      console.error('Error loading PDF:', error)
      return null
    }
  }

  // State to store the PDF document
  const [pdfDocument, setPdfDocument] = useState(null)
  const [pdfPageCount, setPdfPageCount] = useState(0)

  const [pageImages, setPageImages] = useState<string[]>([])

  useEffect(() => {
    if (pdfUrl) {
      loadPdf(pdfUrl).then(async (pdf) => {
        if (pdf) {
          const images: string[] = []
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i)
            const viewport = page.getViewport({ scale: 1.5 })
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            canvas.width = viewport.width
            canvas.height = viewport.height
            await page.render({ canvasContext: context, viewport }).promise
            images.push(canvas.toDataURL()) // Convert canvas to image data URL
          }

          setPageImages(images)
          setPdfPageCount(images.length)
        }
      })
    }
  }, [pdfUrl])

  const goToNextPage = () => {
    if (isFlipping) return
    if (currentPage === 0) {
      if (currentPage < pdfPageCount - 1) {
        setCurrentPage((prevPage) => prevPage + 1)
        return
      }
      if (currentPage < pdfPageCount - 2) {
        setCurrentPage((prevPage) => prevPage + 2)
        return
      }
    }

    if (currentPage < pdfPageCount - 1) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage((prevPage) => prevPage + 1)
        setIsFlipping(false)
      }, 300) // Match animation duration
    }
  }

  const goToPreviousPage = () => {
    if (isFlipping) return

    if (currentPage > 0) {
      setIsFlipping(true)
      setTimeout(() => {
        setCurrentPage((prevPage) => prevPage - 1)
        setIsFlipping(false)
      }, 300) // Match animation duration
    }
  }

  const renderPageContent = () => {
    if (pdfDocument) {
      if (currentPage + 1 === 1) {
        return <PdfPage pdfDocument={pdfDocument} pageNumber={currentPage + 1} />
      } else {
        return (
          <div>
            <PdfPage pdfDocument={pdfDocument} pageNumber={currentPage + 1} />
            <PdfPage pdfDocument={pdfDocument} pageNumber={currentPage + 2} />
          </div>
        )
      }
      // return <PdfPage pdfDocument={pdfDocument} pageNumber={currentPage + 1} />
    } else {
      return <div className="text-center">No content to display.</div>
    }
  }

  return (
    <div>
      <div
        className={cn('container grid place-items-center', {
          'lg:grid-cols-2': currentPage > 0,
          'grid-cols-1': currentPage === 0,
        })}
      >
        <img
          src={pageImages[currentPage]}
          className={cn('object-contain lg:size-[800px]', {
            'lg:place-self-end': currentPage > 0,
          })}
        />
        <img
          src={pageImages[currentPage + 1]}
          className={cn('hidden object-contain lg:size-[800px] lg:place-self-start', {
            'lg:block': currentPage > 0,
          })}
        />

        <button
          onClick={goToPreviousPage}
          className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-200 p-2 hover:bg-gray-300"
          disabled={currentPage === 0 || isFlipping}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
        <button
          onClick={goToNextPage}
          className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-200 p-2 hover:bg-gray-300"
          disabled={currentPage === pdfPageCount - 1 || isFlipping}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </button>
      </div>
    </div>
    // <div className="flex h-screen flex-col items-center justify-center bg-gray-100">
    //   <div className="relative h-96 w-4/5 max-w-2xl overflow-hidden rounded-md bg-white shadow-lg">
    //     <div
    //       ref={bookRef}
    //       className={`relative h-full w-full transition-transform duration-300 ${isFlipping ? 'flipping' : ''} flex`}
    //     >
    //       {renderPageContent()}
    //     </div>

    //     <button
    //       onClick={goToPreviousPage}
    //       className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-200 p-2 hover:bg-gray-300"
    //       disabled={currentPage === 0 || isFlipping}
    //     >
    //       <svg
    //         className="h-6 w-6"
    //         fill="none"
    //         stroke="currentColor"
    //         viewBox="0 0 24 24"
    //         xmlns="http://www.w3.org/2000/svg"
    //       >
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           strokeWidth="2"
    //           d="M15 19l-7-7 7-7"
    //         ></path>
    //       </svg>
    //     </button>

    //     <button
    //       onClick={goToNextPage}
    //       className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-gray-200 p-2 hover:bg-gray-300"
    //       disabled={currentPage === pdfPageCount - 1 || isFlipping}
    //     >
    //       <svg
    //         className="h-6 w-6"
    //         fill="none"
    //         stroke="currentColor"
    //         viewBox="0 0 24 24"
    //         xmlns="http://www.w3.org/2000/svg"
    //       >
    //         <path
    //           strokeLinecap="round"
    //           strokeLinejoin="round"
    //           strokeWidth="2"
    //           d="M9 5l7 7-7 7"
    //         ></path>
    //       </svg>
    //     </button>
    //   </div>
    //   <div className="mt-4 text-gray-600">
    //     Page {currentPage + 1} / {pdfPageCount}
    //   </div>
    // </div>
  )
}

const PdfPage = ({ pdfDocument, pageNumber }) => {
  const [page, setPage] = useState(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const getPage = async () => {
      if (!pdfDocument) return

      try {
        const pdfPage = await pdfDocument.getPage(pageNumber)
        setPage(pdfPage)

        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        const viewport = pdfPage.getViewport({ scale: 1.5 }) // Adjust scale as needed

        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        }

        await pdfPage.render(renderContext).promise
      } catch (error) {
        console.error('Error rendering PDF page:', error)
      }
    }

    getPage()

    return () => {
      if (page) {
        page.cleanup()
      }
    }
  }, [pdfDocument, pageNumber, page])

  return <canvas ref={canvasRef} className="h-full w-full"></canvas>
}
