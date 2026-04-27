import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Menu from './pages/Menu'
import Status from './pages/Status'
import Dashboard from './pages/Dashboard'
import CheckoutDrawer from './components/CheckoutDrawer'
import PaymentModal from './components/PaymentModal'
import Navbar from './components/Navbar'

function App() {
  const [cart, setCart] = useState([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  
  // Shared global orders (mock)
  const [orders, setOrders] = useState([
    { id: "ORD-123", table: 3, customer: "Aisha", items: [{ name: "Beef Suya", qty: 2 }], status: "Kitchen" },
  ])
  
  // Current user order
  const [currentOrder, setCurrentOrder] = useState(null)

  const navigate = useNavigate()
  const location = useLocation()

  // Use URL param for table, defaulting to 5
  const queryParams = new URLSearchParams(location.search)
  const tableNumber = queryParams.get("table") || "5"

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find(i => i.id === item.id)
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...item, qty: 1 }]
    })
  }

  const updateQty = (id, delta) => {
    setCart((prev) => {
      return prev.map(i => {
        if (i.id === id) {
          const newQty = i.qty + delta
          return { ...i, qty: Math.max(0, newQty) }
        }
        return i
      }).filter(i => i.qty > 0)
    })
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)
  const cartItemCount = cart.reduce((sum, item) => sum + item.qty, 0)

  const handleCheckoutSubmit = (customerDetails) => {
    setIsCheckoutOpen(false)
    setIsPaymentOpen(true)
    // Store temporarily to create order after payment
    setCurrentOrder({ ...customerDetails, cart, total: cartTotal, table: tableNumber })
  }

  const handlePaymentSuccess = () => {
    setIsPaymentOpen(false)
    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      table: currentOrder.table,
      customer: currentOrder.name,
      orderType: currentOrder.orderType,
      items: currentOrder.cart,
      total: currentOrder.total,
      status: "Paid",
    }
    setOrders(prev => [newOrder, ...prev])
    setCurrentOrder(newOrder)
    setCart([]) // Clear cart
    navigate('/status')
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    if (currentOrder && currentOrder.id === orderId) {
      setCurrentOrder(prev => ({ ...prev, status: newStatus }))
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-charcoal font-sans flex flex-col relative">
      <Navbar 
        tableNumber={tableNumber} 
        cartItemCount={cartItemCount}
        cartTotal={cartTotal}
        openCheckout={() => setIsCheckoutOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto pb-24 lg:pb-8">
        <Routes>
          <Route path="/" element={<Menu cart={cart} addToCart={addToCart} openCheckout={() => setIsCheckoutOpen(true)} />} />
          <Route path="/status" element={<Status currentOrder={currentOrder} updateOrderStatus={updateOrderStatus} />} />
          <Route path="/dashboard" element={<Dashboard orders={orders} updateOrderStatus={updateOrderStatus} />} />
        </Routes>
      </main>

      <CheckoutDrawer 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        cart={cart} 
        updateQty={updateQty} 
        total={cartTotal} 
        onSubmit={handleCheckoutSubmit} 
      />
      
      <PaymentModal 
        isOpen={isPaymentOpen} 
        total={cartTotal}
        onSuccess={handlePaymentSuccess} 
        onCancel={() => setIsPaymentOpen(false)} 
      />
    </div>
  )
}

export default App
