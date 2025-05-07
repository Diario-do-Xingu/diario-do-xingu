// 'use client'

// import { Document, Page, pdfjs } from 'react-pdf'

// import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
// import 'react-pdf/dist/esm/Page/TextLayer.css'
// import { useEffect, useState } from 'react'
// import dynamic from 'next/dynamic'

// const HTMLFlipBook = dynamic(() => import('react-pageflip'), { ssr: false })
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`

// export function PageClient() {
//   const [pageImages, setPageImages] = useState<string[]>([])

//   useEffect(() => {
//     const loadPFD = async () => {
//       const pdf = await pdfjs.getDocument('/test.pdf').promise

//       const images: string[] = []
//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i)
//         const viewport = page.getViewport({ scale: 1.5 })
//         const canvas = document.createElement('canvas')
//         const context = canvas.getContext('2d')

//         canvas.width = viewport.width
//         canvas.height = viewport.height

//         await page.render({ canvasContext: context, viewport }).promise
//         images.push(canvas.toDataURL()) // Convert canvas to image data URL
//       }

//       setPageImages(images)
//     }

//     loadPFD()
//   }, [])

//   if (pageImages.length === 0 || render === false) return null

//   return (

//     // <HTMLFlipBook
//     //   width={400}
//     //   height={500}
//     //   showCover={true}
//     //   autoSize={true}
//     //   size="fixed"
//     //   //   usePortrait={true}
//     //   //   startPage={1}
//     //   //   style={{ margin: 'auto' }}
//     //   className=""
//     // >
//     //   {/* <div> */}
//     //   <div className="bg-gray-100">
//     //     <img src={pageImages[0]} alt="Cover Page" className="object-contain" />
//     //   </div>

//     //   {/* Other Pages */}
//     //   <div className="bg-gray-100">
//     //     <img src={pageImages[1]} alt="Page 1" className="object-contain" />
//     //   </div>
//     //   <div className="bg-gray-100">
//     //     <img src={pageImages[2]} alt="Page 2" className="object-contain" />
//     //   </div>
//     //   {/* </div> */}

//     //   {/* {pageImages.map((src, idx) => (
//     //       <div key={idx} className="page">
//     //         <img src={src} alt={`Page ${idx + 1}`} style={{ width: '100%', height: '100%' }} />
//     //       </div>
//     //     ))} */}

//     //   {/* <div> */}
//     //   {/* <Document
//     //         onLoadSuccess={({ numPages }) => {
//     //           setNumOfPages(numPages)
//     //         }}
//     //         file={'/test.pdf'}
//     //       >
//     //         {Array.from(new Array(numOfPages)).map((_, idx) => (
//     //           <div key={idx}>
//     //             <Page pageNumber={idx + 1} />
//     //           </div>
//     //         ))}
//     //       </Document> */}
//     //   {/* </div> */}
//     // </HTMLFlipBook>
//   )
// }
