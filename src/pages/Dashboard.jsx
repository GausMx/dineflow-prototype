import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Clock } from 'lucide-react'

export default function Dashboard({ orders, updateOrderStatus }) {
  // Only show active orders (not served)
  const activeOrders = orders.filter(o => o.status !== 'Served')

  return (
    <div className="min-h-full bg-transparent p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal">Waiter Feed</h1>
        <p className="text-gray-500 mt-1">{activeOrders.length} active orders</p>
      </header>

      {activeOrders.length === 0 ? (
        <div className="text-center py-32 text-gray-400 bg-white rounded-3xl shadow-sm border border-gray-100">
          <CheckCircle2 size={64} className="mx-auto mb-4 opacity-50 text-green-500" />
          <h2 className="text-xl font-semibold text-charcoal mb-2">All clear!</h2>
          <p>Great job. There are no active orders right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {activeOrders.map((order) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: -100 }}
                transition={{ duration: 0.3 }}
                key={order.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="bg-charcoal text-white text-xs font-bold px-2.5 py-1 rounded-md">
                        Table {order.table}
                      </span>
                      {order.orderType && (
                        <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-md">
                          {order.orderType}
                        </span>
                      )}
                      <span className="text-sm font-medium text-gray-400">#{order.id}</span>
                    </div>
                    <h3 className="text-xl font-bold text-charcoal mt-3">{order.customer}</h3>
                  </div>
                  
                  <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1.5 ${
                    order.status === 'Paid' ? 'bg-blue-100 text-blue-700' :
                    order.status === 'Kitchen' ? 'bg-orange-100 text-orange-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    <Clock size={14} />
                    <span>{order.status}</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6 bg-gray-50 rounded-xl p-4 flex-1">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm items-center">
                      <span className="text-charcoal font-medium flex items-center">
                        <span className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs text-gray-500 mr-3 shadow-sm">{item.qty}x</span>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3 mt-auto">
                  {order.status !== 'Delivery' ? (
                    <button 
                      onClick={() => updateOrderStatus(order.id, order.status === 'Paid' ? 'Kitchen' : 'Delivery')}
                      className="flex-1 bg-gray-100 text-charcoal font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      Move to {order.status === 'Paid' ? 'Kitchen' : 'Delivery'}
                    </button>
                  ) : (
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'Served')}
                      className="flex-1 bg-gold text-white font-bold py-3.5 rounded-xl hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2 shadow-md shadow-gold/20"
                    >
                      <CheckCircle2 size={20} />
                      <span>Mark as Served</span>
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
