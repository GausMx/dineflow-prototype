import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react'

export default function PaymentModal({ isOpen, total, onSuccess, onCancel }) {
  const [paymentState, setPaymentState] = useState('idle') // idle, authenticating, processing, success

  useEffect(() => {
    if (isOpen) {
      setPaymentState('authenticating')
      
      const authTimer = setTimeout(() => setPaymentState('processing'), 1500)
      const processTimer = setTimeout(() => setPaymentState('success'), 3500)
      const successTimer = setTimeout(() => {
        onSuccess()
        setPaymentState('idle')
      }, 5000)

      return () => {
        clearTimeout(authTimer)
        clearTimeout(processTimer)
        clearTimeout(successTimer)
      }
    } else {
      setPaymentState('idle')
    }
  }, [isOpen, onSuccess])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-charcoal/80 backdrop-blur-md z-[60] flex items-center justify-center p-6"
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative"
          >
            {/* Simulated Flutterwave Header */}
            <div className="bg-[#FBDFCA]/30 px-6 py-4 border-b border-orange-100 flex items-center space-x-2">
              <div className="w-6 h-6 bg-orange-500 rounded-sm flex items-center justify-center">
                 {/* Faking a logo */}
                 <span className="text-white text-xs font-bold">F</span>
              </div>
              <span className="text-sm font-semibold text-charcoal">Flutterwave Checkout</span>
            </div>

            <div className="p-8 flex flex-col items-center justify-center min-h-[300px] text-center space-y-6">
              
              {paymentState === 'authenticating' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  className="flex flex-col items-center"
                >
                  <ShieldCheck size={48} className="text-blue-500 mb-4 animate-pulse" />
                  <h3 className="text-lg font-semibold text-charcoal">Authenticating</h3>
                  <p className="text-sm text-gray-500 mt-2">Connecting securely...</p>
                </motion.div>
              )}

              {paymentState === 'processing' && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <Loader2 size={48} className="text-orange-500 mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold text-charcoal">Processing Payment</h3>
                  <p className="text-sm text-gray-500 mt-2">Please wait while we process ₦{total.toLocaleString()}...</p>
                </motion.div>
              )}

              {paymentState === 'success' && (
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <CheckCircle2 size={64} className="text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-charcoal">Payment Successful!</h3>
                  <p className="text-sm text-gray-500 mt-2">Redirecting to your order status...</p>
                </motion.div>
              )}
            </div>

            {/* Simulated close button just for demo */}
            {paymentState !== 'success' && (
              <button 
                onClick={onCancel}
                className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-400 hover:text-gray-600 underline"
              >
                Cancel Payment
              </button>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
