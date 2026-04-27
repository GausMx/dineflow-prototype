import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Plus } from 'lucide-react'
import { categories, menuItems } from '../data'

export default function Menu({ cart, addToCart, openCheckout }) {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredItems = activeCategory === "All" 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory)

  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <div className="flex flex-col h-full bg-[#FAFAFA]">
      
      {/* Category Tabs */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sticky top-[64px] z-20 bg-[#FAFAFA]/95 backdrop-blur-sm">
        <div className="flex space-x-3 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                activeCategory === cat 
                ? 'bg-charcoal text-white shadow-md' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={item.id} 
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 sm:h-56 w-full">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  {item.popular && (
                    <div className="absolute top-3 left-3 bg-gold text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                      POPULAR
                    </div>
                  )}
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-charcoal leading-tight mb-2">{item.name}</h3>
                    <p className="text-gray-500 text-sm leading-snug mb-4 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <div>
                      <span className="font-bold text-lg text-charcoal">₦{item.price.toLocaleString()}</span>
                      <span className="text-xs text-gray-400 ml-1">/ portion</span>
                    </div>
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addToCart(item)}
                      className="bg-charcoal text-white rounded-full p-2.5 shadow-md hover:bg-gray-800 transition-colors"
                    >
                      <Plus size={20} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Floating View Basket Button (Mobile Only) */}
      {cartItemCount > 0 && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="md:hidden fixed bottom-6 left-0 right-0 px-6 z-20 flex justify-center"
        >
          <div className="w-full max-w-md">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={openCheckout}
              className="w-full bg-gold text-white font-bold py-4 rounded-2xl shadow-xl flex items-center justify-between px-6 hover:bg-yellow-500 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <ShoppingBag size={20} />
                <span>View Order ({cartItemCount})</span>
              </div>
              <span>
                ₦{cart.reduce((sum, item) => sum + (item.price * item.qty), 0).toLocaleString()}
              </span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
