import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus } from 'lucide-react'

export default function CheckoutDrawer({ isOpen, onClose, cart, updateQty, total, onSubmit }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [orderType, setOrderType] = useState('Dine-In')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !phone) return
    onSubmit({ name, phone, orderType })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal/40 backdrop-blur-sm z-40"
          />
          
          {/* Drawer / Side Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 max-w-md mx-auto md:max-w-none md:mx-0 md:left-auto md:top-0 md:right-0 md:w-96 w-full bg-white rounded-t-3xl md:rounded-none shadow-2xl z-50 flex flex-col max-h-[85vh] md:max-h-full md:h-full"
          >
            <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-3xl md:rounded-none sticky top-0 z-10">
              <h2 className="text-xl font-bold text-charcoal">Your Order</h2>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto p-6 space-y-6 flex-1">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 py-10 flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">🛒</span>
                  </div>
                  Your basket is empty
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex-1">
                        <h4 className="font-medium text-charcoal">{item.name}</h4>
                        <span className="text-gold font-semibold">₦{item.price.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-3 bg-gray-50 p-1 rounded-full border border-gray-100">
                        <button type="button" onClick={() => updateQty(item.id, -1)} className="p-1.5 bg-white rounded-full shadow-sm text-charcoal hover:bg-gray-100">
                          <Minus size={16} />
                        </button>
                        <span className="font-semibold w-4 text-center text-sm">{item.qty}</span>
                        <button type="button" onClick={() => updateQty(item.id, 1)} className="p-1.5 bg-white rounded-full shadow-sm text-charcoal hover:bg-gray-100">
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t border-gray-100 pt-4 mt-6 flex justify-between items-center">
                    <span className="font-medium text-gray-500">Total</span>
                    <span className="text-2xl font-bold text-charcoal">₦{total.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {cart.length > 0 && (
                <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4 pt-6 border-t border-gray-100">
                  <h3 className="font-semibold text-charcoal mb-2">Your Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input 
                      required
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Chinedu"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      required
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 08012345678"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dining Option</label>
                    <div className="relative">
                      <select
                        value={orderType}
                        onChange={(e) => setOrderType(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all"
                      >
                        <option value="Dine-In">Dine In</option>
                        <option value="Takeaway">Takeaway</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 bg-white border-t border-gray-100 sticky bottom-0 z-10">
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  form="checkout-form"
                  className="w-full bg-charcoal text-white font-bold py-4 rounded-xl shadow-lg hover:bg-gray-800 transition-colors"
                >
                  Pay ₦{total.toLocaleString()}
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
