'use client';
import { useState } from 'react';
import Link from 'next/link';


export default function Header() {
  const [isNavbarOpen, setIsNavbarOpen] = useState(false);
  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };


  return (
    <div className="bg-gray-100 flex flex-col">
      {/* Main Content */}
      <div className="flex flex-col">
        {/* Header */}
                    <header
                        className="fixed top-0 w-full bg-blue-800 px-4 py-3 shadow-md flex justify-between items-center z-50 transition-transform duration-100">
                        <div className="flex items-center space-x-2">
                        <img src="/LOGO1.png" alt="FinestTraders Logo for Header" className="h-14" />
                        <span className="font-semibold text-sm md:text-lg text-yellow-500">FinestTraders</span>
                        </div>
                        <div className="md:hidden">
                        <button
                            className="text-white text-3xl focus:outline-none"
                            onClick={toggleNavbar}
                            aria-label="Toggle navigation menu"
                        >
                            ☰
                        </button>
                        </div>
                        {/* Navbar for Medium and Large Screens */}
                        <nav className="hidden md:flex space-x-6 mr-10">
                        <Link href="/" className="text-white font-semibold text-lg hover:text-yellow-500">
                            Home
                        </Link>
                        <Link href="/finesttool" className="text-white font-semibold text-lg hover:text-yellow-500">
                            Finest Tool
                        </Link>
                        <Link href="/derivchart" className="text-white font-semibold text-lg hover:text-yellow-500">
                            Deriv Chart
                        </Link>
                        <Link href="/tradingview" className="text-white font-semibold text-lg hover:text-yellow-500">
                            Trading View
                        </Link>
                        <Link href="/ai-bots" className="text-white font-semibold text-lg hover:text-yellow-500">
                            AI Bots
                        </Link>
                        <Link href="/strategy" className="text-white font-semibold text-lg hover:text-yellow-500">
                            Strategy
                        </Link>
                        </nav>
                    </header>

                 {/* Slide-Up Navbar (for mobile screens) */}
                    <div
                        className={`fixed bottom-0 w-full bg-yellow-600 transform ${
                        isNavbarOpen ? 'translate-y-0' : 'translate-y-full'
                        } transition-transform duration-300 z-30 md:hidden`}
                    >
                        <div className="flex justify-between items-center px-4 py-3 bg-blue-800">
                        <span className="text-white font-semibold text-lg">Menu</span>
                        <button
                            className="text-white text-3xl focus:outline-none"
                            onClick={toggleNavbar}
                        >
                            ✕
                        </button>
                        </div>
                        <ul className="space-y-4 px-4 py-6 text-center">
                        <li>
                            <Link
                            href="/"
                            className="block text-blue-800 font-semibold text-lg hover:text-gray-800"
                            onClick={toggleNavbar}
                            >
                            Home
                            </Link>
                        </li>
                        <li>
                            <Link
                            href="/finesttool"
                            className="block text-blue-800 font-semibold text-lg hover:text-gray-800"
                            onClick={toggleNavbar}
                            >
                            Finest Analysis Tool
                            </Link>
                        </li>
                        <li>
                            <Link
                            href="/derivchart"
                            className="block text-blue-800 font-semibold text-lg hover:text-gray-800"
                            onClick={toggleNavbar}
                            >
                            Deriv Chart
                            </Link>
                        </li>
                        <li>
                            <Link
                            href="/tradingview"
                            className="block text-blue-800 font-semibold text-lg hover:text-gray-800"
                            onClick={toggleNavbar}
                            >
                            Trading View
                            </Link>
                        </li>
                        <li>
                            <Link
                            href="/ai-bots"
                            className="block text-blue-800 font-semibold text-lg hover:text-gray-800"
                            onClick={toggleNavbar}
                            >
                            AI Bots
                            </Link>
                        </li>
                        <li>
                            <Link
                            href="/strategy"
                            className="block text-blue-800 font-semibold text-lg hover:text-gray-800"
                            onClick={toggleNavbar}
                            >
                            Strategy
                            </Link>
                        </li>
                        
                        </ul>
                    </div>
        
      </div>
    </div>
  );
}
