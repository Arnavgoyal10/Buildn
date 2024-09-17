'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import Image from 'next/image'
import { SparklesCore } from './animations/SparklesCore'
import { FloatingDock } from './animations/FloatingDock'

import { cn } from "@/lib/utils"
import { IconHome, IconSearch, IconBell, IconUser } from "@tabler/icons-react"

export default function TVZoomOutBlurFixed() {
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const [showContent, setShowContent] = useState(false)
  const [dockOpacity, setDockOpacity] = useState(0)

  useEffect(() => {
    let scrollAnimationFrame: number

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (!scrollAnimationFrame) {
        scrollAnimationFrame = requestAnimationFrame(() => {
          setProgress(prev => {
            const newProgress = Math.min(Math.max(prev + e.deltaY * 0.001, 0), 1)
            if (newProgress >= 0.9) {
              setDockOpacity((newProgress - 0.9) * 10) // Smooth appearance from 90% to 100%
            }
            if (newProgress === 1 && prev !== 1) {
              setShowContent(true)
            }
            return newProgress
          })
          scrollAnimationFrame = 0
        })
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel)
      }
      if (scrollAnimationFrame) {
        cancelAnimationFrame(scrollAnimationFrame)
      }
    }
  }, [])

  const scale = 5 - progress * 4
  const blur = Math.max(0, (progress - 0.5) * 20)

  const dockItems = [
    { title: "Home", icon: <IconHome className="h-8 w-8" />, href: "/" },  // Increased icon size
    { title: "Search", icon: <IconSearch className="h-8 w-8" />, href: "/search" },
    { title: "Notifications", icon: <IconBell className="h-8 w-8" />, href: "/notifications" },
    { title: "Profile", icon: <IconUser className="h-8 w-8" />, href: "/profile" },
  ]

  // Memoize the SparklesCore to prevent re-rendering
  const memoizedSparklesCore = useMemo(() => (
    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
      <h1 className="text-white text-8xl font-bold relative animate-underline no-blur z-10">
        BuildN
      </h1>
      <div className="w-[40vw] h-[20vh] mt-4">
        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />
      </div>
    </div>
  ), [])

  return (
    <div>
      <div ref={containerRef} className="w-full h-screen overflow-hidden">
        <div
          className="w-full h-full transition-all duration-100 ease-out"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: '50% 35%',
            filter: `blur(${blur}px)`,
          }}
        >
          <Image
            src="/images/image1.png"
            alt="Background"
            layout="fill"
            objectFit="cover"
            quality={100}
          />
        </div>

        {/* Use memoized SparklesCore to prevent unnecessary re-renders */}
        {memoizedSparklesCore}
      </div>

      {showContent && (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center p-8">
          <h2 className="text-4xl font-bold mb-6">Welcome to BuildN</h2>
          <p className="text-xl mb-4">
            BuildN is a revolutionary platform for creating and managing your projects.
          </p>
          <p className="text-xl mb-4">
            With our intuitive tools and powerful features, you can bring your ideas to life faster than ever before.
          </p>
          <p className="text-xl">
            Start building your dreams today with BuildN!
          </p>
        </div>
      )}

      <FloatingDock
        items={dockItems}
        desktopClassName={cn(
          "fixed bottom-16 left-1/2 transform -translate-x-1/2 transition-opacity duration-300",  // Moved up by changing bottom from 8 to 16
          dockOpacity > 0 ? "opacity-100" : "opacity-0"
        )}
        mobileClassName={cn(
          "fixed bottom-12 right-4 transition-opacity duration-300",  // Moved up mobile dock as well
          dockOpacity > 0 ? "opacity-100" : "opacity-0"
        )}
      />

      <style jsx>{`
        .animate-underline::after {
          content: '';
          position: absolute;
          width: 0;
          height: 4px;
          background-color: white;
          bottom: -10px;
          left: 0;
          transition: width 0.5s ease-in-out;
        }
        .animate-underline:hover::after {
          width: 100%;
        }
        .no-blur {
          filter: none !important;
        }
      `}</style>
    </div>
  )
}
