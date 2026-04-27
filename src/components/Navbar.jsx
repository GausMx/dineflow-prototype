import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu as MenuIcon, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar({ tableNumber, cartItemCount, cartTotal, openCheckout }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const links = [
    { name: 'Menu', path: '/' },
    { name: 'Order Status', path: '/status' },
    { name: 'Waiter Dashboard', path: '/dashboard' },
  ]

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo & Mobile Menu Toggle */}
            <div className="flex items-center space-x-4">
              <button 
                className="md:hidden p-2 -ml-2 text-charcoal"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <MenuIcon size={24} />
              </button>
              <Link to="/" className="flex flex-col justify-center">
                <h1 className="text-xl md:text-2xl font-bold tracking-tight text-charcoal leading-none">DineFlow</h1>
                <span className="text-xs text-gray-500 font-medium">Delight Restaurant</span>
              </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex space-x-8 items-center">
              {links.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path}
                  className={`text-sm font-semibold transition-colors ${
                    location.pathname === link.path ? 'text-gold' : 'text-gray-500 hover:text-charcoal'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right side info / Cart */}
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="bg-gold/10 text-gold px-3 py-1 rounded-full text-xs md:text-sm font-semibold border border-gold/20 whitespace-nowrap">
                Table {tableNumber}
              </div>
              
              {/* Desktop Cart Button */}
              {location.pathname === '/' && (
                <button
                  onClick={openCheckout}
                  className="hidden md:flex items-center space-x-2 bg-charcoal text-white px-4 py-2 rounded-full shadow-sm hover:bg-gray-800 transition-colors"
                >
                  <ShoppingBag size={18} />
                  <span className="text-sm font-bold">{cartItemCount > 0 ? `₦${cartTotal.toLocaleString()}` : 'Cart'}</span>
                  {cartItemCount > 0 && (
                    <span className="bg-gold text-white text-xs px-2 py-0.5 rounded-full ml-1">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              )}
            </div>

          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-64 bg-white shadow-2xl z-50 flex flex-col md:hidden"
            >
              <div className="p-4 flex justify-between items-center border-b border-gray-100">
                <h2 className="text-xl font-bold text-charcoal">Menu</h2>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 flex flex-col space-y-2 flex-1">
                {links.map(link => (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl font-medium transition-colors ${
                      location.pathname === link.path ? 'bg-gold/10 text-gold' : 'text-charcoal hover:bg-gray-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
