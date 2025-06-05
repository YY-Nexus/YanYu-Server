"use client"

import { useState, useEffect } from "react"

export function viewport() {
  if (typeof window === "undefined") {
    return { width: 1024, height: 768 } // 默认值用于服务器端
  }

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  }
}

export function useViewport() {
  const [dimensions, setDimensions] = useState({ width: 1024, height: 768 })

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize() // 初始化
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return dimensions
}
