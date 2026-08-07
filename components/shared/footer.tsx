// import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Facebook, Youtube, Phone, Mail, MapPin } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useState } from 'react'
import Image from 'next/image'

export default function Footer() {
  const [hovered, setHovered] = useState(false)

  const links = [
    'https://www.facebook.com/profile.php?id=100085063104502',
    'https://www.facebook.com/profile.php?id=61581864242736',
  ]

  return (
    <footer className="bg-white border-t border-gray-200 mt-16 mb-20 md:mb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          {/* Logo and Social Section */}
          <div className="flex flex-col items-start">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 mb-6">
              <div className="flex flex-col">
                <span className="font-bold text-green-700 flex flex-col sm:flex-row items-start sm:items-center sm:space-x-2">
                  {/* Bengali text */}
                  <span className="text-sm sm:text-base mb-2 sm:mb-0">
                    জীবনের প্রয়োজনে ।
                  </span>

                  {/* Logo image */}
                  <span className="flex items-center space-x-1">
                    <Image
                      src="/logo.jpg"
                      alt="Anuka Logo"
                      width={80}
                      height={100}
                      className="object-contain rounded-md"
                      style={{ width: '80px', height: '100px' }}
                    />
                  </span>
                </span>
              </div>
            </Link>

            {/* Founder Info */}
            <div className="flex flex-col font-bold text-green-700 text-sm sm:text-base mb-6">
              <span>Morshed A. Chowdhury</span>
              <span>Founder & CEO</span>
            </div>

            {/* Social Icons */}
            <div className="flex space-x-3">
              <a
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 sm:w-9 sm:h-9 text-gray-600 hover:text-green-600 bg-transparent"
                >
                  <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </a>
              <div
                className="relative flex items-center justify-center"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                {/* Main Facebook Icon */}
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 sm:w-9 sm:h-9 text-gray-600 hover:text-green-600 bg-transparent"
                >
                  <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>

                {/* Child Icons (Expandable on hover) */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={
                    hovered
                      ? {
                          opacity: 1,
                          scale: 1,
                          y: 0,
                          transition: { staggerChildren: 0.1 },
                        }
                      : { opacity: 0, scale: 0.8, y: 10 }
                  }
                  className="absolute top-10 sm:top-12 flex gap-2 sm:gap-3 bg-white p-2 rounded-xl shadow-lg z-10"
                >
                  {links.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={
                        hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }
                      }
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <motion.div whileHover={{ scale: 1.15 }}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-9 h-9 sm:w-11 sm:h-11 text-blue-600 border-blue-400 hover:shadow-md hover:shadow-blue-200 bg-transparent transition-all duration-300 rounded-full"
                        >
                          <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </motion.div>
                    </motion.a>
                  ))}
                </motion.div>
              </div>

              <a
                href="https://wa.me/+8801721811197"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8 sm:w-9 sm:h-9 text-gray-600 hover:text-green-600 bg-transparent"
                >
                  <FaWhatsapp className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
              Quick Links
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-600">
              <li>
                <a href="#" className="hover:text-green-600 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
              Categories
            </h3>
            <ul className="space-y-2 text-sm sm:text-base text-gray-600">
              <li>
                <a href="#" className="hover:text-green-600 transition-colors">
                  Fresh Produce
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition-colors">
                  Dairy Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition-colors">
                  Meat & Poultry
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-green-600 transition-colors">
                  Spices & Condiments
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">
              Contact Info
            </h3>
            <div className="space-y-3 text-sm sm:text-base text-gray-600">
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  House # 64, Road # 04, Block # B, Chandgaon Residential Area,
                  Chittagong.
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span>01333-727648</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="break-all">chowdhurymorshed602@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-200 mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-600">
          <p>
            &copy; {new Date().getFullYear()} Anuka Organic. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
