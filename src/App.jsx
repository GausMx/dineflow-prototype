import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { collection, addDoc, updateDoc, doc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { db } from './firebase'
import Menu from './pages/Menu'
import Status from './pages/Status'
import Dashboard from './pages/Dashboard'
import QRCodes from './pages/QRCodes'
import CheckoutDrawer from './components/CheckoutDrawer'
import PaymentModal from './components/PaymentModal'
import Navbar from './components/Navbar'

function App() {
  const [cart, setCart] = useState([])
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  
  // Real-time global orders from Firebase
  const [orders, setOrders] = useState([])
  
  // Current user order with localStorage persistence
  const [currentOrder, setCurrentOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('currentOrder')
      return saved ? JSON.parse(saved) : null
    } catch (e) {
      return null
    }
  })

  // Save current order to local storage whenever it changes
  useEffect(() => {
    if (currentOrder) {
      localStorage.setItem('currentOrder', JSON.stringify(currentOrder))
    } else {
      localStorage.removeItem('currentOrder')
    }
  }, [currentOrder])

  const navigate = useNavigate()
  const location = useLocation()

  // Use URL param for table, defaulting to 5
  const queryParams = new URLSearchParams(location.search)
  const tableNumber = queryParams.get("table") || "5"

  // Setup Firebase real-time listener
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setOrders(ordersData)
      
      // Update the current order status if it changed in the backend
      setCurrentOrder(prevOrder => {
        if (!prevOrder) return prevOrder;
        const updated = ordersData.find(o => o.id === prevOrder.id)
        if (updated && updated.status !== prevOrder.status) {
          return { ...prevOrder, status: updated.status }
        }
        return prevOrder;
      })
    }, (error) => {
      console.error("Error fetching orders from Firebase:", error)
      alert("Firebase Read Error! The database is rejecting reads. Error: " + error.message)
    })
    
    return () => unsubscribe()
  }, [])

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

  const handlePaymentSuccess = async () => {
    setIsPaymentOpen(false)
    
    // 1. Instantly clear the cart and navigate so the customer is never blocked
    setCart([])
    navigate('/status')
    
    const newOrderData = {
      table: currentOrder.table || tableNumber,
      customer: currentOrder.name || "Customer",
      orderType: currentOrder.orderType || "Dine-In",
      items: currentOrder.cart || cart,
      total: currentOrder.total || cartTotal,
      status: "Paid",
      createdAt: serverTimestamp()
    }

    try {
      // 2. Add to Firebase
      const docRef = await addDoc(collection(db, "orders"), newOrderData)
      // 3. Update local state with the REAL Firebase ID so real-time sync matches
      setCurrentOrder({ id: docRef.id, ...newOrderData })
    } catch (e) {
      console.error("Error saving order to Firebase:", e)
      setCurrentOrder({ id: `LOCAL-${Math.floor(Math.random() * 10000)}`, ...newOrderData })
      alert("Firebase Write Error! The database is rejecting writes. Did you set it to Test Mode? Error: " + e.message)
    }
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId)
      await updateDoc(orderRef, {
        status: newStatus
      })
    } catch (e) {
      console.error("Error updating order in Firebase:", e)
      alert("Firebase Update Error! " + e.message)
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
          <Route path="/qrcodes" element={<QRCodes />} />
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
