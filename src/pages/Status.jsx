import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Check, ChefHat, Utensils, ArrowLeft } from 'lucide-react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export default function Status({ currentOrder, updateOrderStatus }) {
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [liveOrder, setLiveOrder] = useState(currentOrder)

  const steps = [
    { label: "Paid", icon: Check, status: "Paid" },
    { label: "In the Kitchen", icon: ChefHat, status: "Kitchen" },
    { label: "Out for Delivery", icon: Utensils, status: "Delivery" }
  ]

  // Keep liveOrder in sync if the parent passes a new currentOrder (like immediately after payment)
  useEffect(() => {
    setLiveOrder(currentOrder)
  }, [currentOrder])

  // Bulletproof real-time listener specifically for this single order
  useEffect(() => {
    if (!currentOrder || !currentOrder.id || currentOrder.id.startsWith('LOCAL')) return;
    
    const orderRef = doc(db, "orders", currentOrder.id)
    const unsubscribe = onSnapshot(orderRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data()
        setLiveOrder(prev => ({ ...prev, ...data, id: docSnapshot.id }))
      }
    })
    
    return () => unsubscribe()
  }, [currentOrder?.id])

  useEffect(() => {
    if (!liveOrder) {
      navigate('/')
      return
    }
  }, [liveOrder, navigate])

  useEffect(() => {
    if (liveOrder) {
      const index = steps.findIndex(s => s.status === liveOrder.status)
      if (index !== -1) setStepIndex(index)
      if (liveOrder.status === 'Served') setStepIndex(3) // Beyond our visual steps
    }
  }, [liveOrder])

  if (!liveOrder) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Utensils size={32} className="text-gray-400" />
      </div>
      <h2 className="text-2xl font-bold text-charcoal mb-2">No Active Order</h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">You haven't placed any orders yet. Go back to the menu to explore our delicious options.</p>
      <button 
        onClick={() => navigate('/')}
        className="bg-charcoal text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg"
      >
        View Menu
      </button>
    </div>
  )

  return (
    <div className="flex flex-col h-full bg-transparent relative p-4 sm:p-6 lg:p-8">
      <header className="flex items-center space-x-4 mb-8">
        <button onClick={() => navigate('/')} className="p-2.5 bg-white shadow-sm border border-gray-100 rounded-full text-gray-600 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-charcoal">Order Status</h2>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Table {liveOrder.table} • <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-xs">#{liveOrder.id}</span></p>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12 max-w-3xl mx-auto w-full">
        
        {liveOrder.status === 'Served' ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-4"
          >
            <div className="w-28 h-28 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto mb-8 border-4 border-gold/20">
              <Utensils size={56} />
            </div>
            <h3 className="text-3xl sm:text-4xl font-bold text-charcoal">Enjoy your meal!</h3>
            <p className="text-gray-500 text-lg">Your order has been served.</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-10 bg-charcoal text-white px-10 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg w-full sm:w-auto"
            >
              Order Again
            </button>
          </motion.div>
        ) : (
          <div className="relative pl-8 md:pl-12 space-y-16 border-l-2 border-gray-200 py-4 w-full max-w-md mx-auto">
            {steps.map((step, idx) => {
              const isPast = idx < stepIndex
              const isCurrent = idx === stepIndex
              const Icon = step.icon

              return (
                <div key={idx} className="relative">
                  <motion.div 
                    initial={false}
                    animate={{ 
                      backgroundColor: isPast || isCurrent ? '#F59E0B' : '#FFFFFF',
                      borderColor: isPast || isCurrent ? '#F59E0B' : '#E5E7EB',
                      color: isPast || isCurrent ? '#FFFFFF' : '#9CA3AF'
                    }}
                    className="absolute -left-[49px] md:-left-[65px] top-0 w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center bg-white"
                  >
                    <Icon size={isCurrent ? 24 : 20} />
                  </motion.div>
                  
                  <div className={`${isCurrent ? 'opacity-100 scale-105 transform origin-left transition-all duration-300' : 'opacity-50'} -mt-1 md:mt-1`}>
                    <h4 className={`text-xl md:text-2xl font-bold ${isCurrent ? 'text-charcoal' : 'text-gray-500'}`}>
                      {step.label}
                    </h4>
                    {isCurrent && (
                      <p className="text-gray-500 mt-2 text-base md:text-lg">
                        {idx === 0 && "We've received your payment."}
                        {idx === 1 && "Our chefs are preparing your order."}
                        {idx === 2 && "Your waiter is bringing it to you!"}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
