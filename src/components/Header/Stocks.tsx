'use client'

import { useEffect, useRef } from 'react'

export function Stocks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scriptRef = useRef<HTMLScriptElement>(null)

  useEffect(() => {
    // Avoid duplicate scripts
    if (scriptRef.current) return

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.type = 'text/javascript'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: symbols,
      showSymbolLogo: true,
      isTransparent: false,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'br',
    })

    if (containerRef.current) {
      containerRef.current.appendChild(script)
      scriptRef.current = script
    }

    return () => {
      if (scriptRef.current?.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current)
        scriptRef.current = null
      }
    }
  }, [])

  return (
    <div className="tradingview-widget-container">
      <div className="tradingview-widget-container__widget" ref={containerRef} />
    </div>
  )
}

const symbols = [
  {
    proName: 'FX_IDC:EURUSD',
    title: 'EUR to USD',
  },
  {
    proName: 'BITSTAMP:BTCUSD',
    title: 'Bitcoin',
  },
  {
    proName: 'BITSTAMP:ETHUSD',
    title: 'Ethereum',
  },
  {
    description: 'Dolar',
    proName: 'FX_IDC:USDBRL',
  },
  {
    description: 'AGRO3',
    proName: 'BMFBOVESPA:AGRO3',
  },
  {
    description: 'SOJA3',
    proName: 'BMFBOVESPA:SOJA3',
  },
  {
    description: 'SLCE3',
    proName: 'BMFBOVESPA:SLCE3',
  },
  {
    description: 'VITT3',
    proName: 'BMFBOVESPA:VITT3',
  },
  {
    description: 'BRFS3',
    proName: 'BMFBOVESPA:BRFS3',
  },
  {
    description: 'CAML3',
    proName: 'BMFBOVESPA:CAML3',
  },
  {
    description: 'JBSS3',
    proName: 'BCBA:JBSS3',
  },
  {
    description: 'MRFG3',
    proName: 'BMFBOVESPA:MRFG3',
  },
  {
    description: 'TTEN3',
    proName: 'BMFBOVESPA:TTEN3',
  },
  {
    description: 'BOEING',
    proName: 'NYSE:BA',
  },
  {
    description: 'AMAZON',
    proName: 'NASDAQ:AMZN',
  },
  {
    description: 'NETFLIX',
    proName: 'NASDAQ:NFLX',
  },
  {
    description: 'BB',
    proName: 'GETTEX:BZLA',
  },
]
