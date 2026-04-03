import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Package,
  ArrowUpRight,
  Search,
  Bell,
  RefreshCw
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { useOrders } from '../context/OrderContext';
import { useProducts } from '../context/ProductContext';

const AdminDashboard = () => {
  const { orders } = useOrders();
  const { products } = useProducts();
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    setLastUpdated(new Date());
  }, [orders, products]);

  const stats = useMemo(() => {
    const totalOrders = orders.length;
    
    // Calculate total revenue (assuming confirmed payments)
    const confirmedOrders = orders.filter(o => o.status === 'Payment Confirmed' || o.status === 'Delivered');
    const totalRevenue = confirmedOrders.reduce((acc, order) => {
      const price = parseFloat(order.product.price.replace(/[^0-9.]/g, '')) || 0;
      return acc + (price * (order.product.quantity || 1));
    }, 0);

    const uniqueCustomers = new Set(orders.map(o => o.contact.email)).size;
    const totalProductsSold = confirmedOrders.reduce((acc, o) => acc + (o.product.quantity || 1), 0);

    return {
      totalRevenue: totalRevenue.toLocaleString(undefined, { style: 'currency', currency: 'USD' }),
      totalOrders: totalOrders.toLocaleString(),
      activeCustomers: uniqueCustomers.toLocaleString(),
      productsSold: totalProductsSold.toLocaleString()
    };
  }, [orders]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  const topProducts = useMemo(() => {
    // Simple logic: most recent products or products with most orders
    // For now, let's just show the first 4 products
    return products.slice(0, 4);
  }, [products]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-[#f20c92] selection:text-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen bg-gray-50 relative pb-20 md:pb-0 pt-16 md:pt-0">
        {/* Header */}
        <header className="h-16 md:h-20 border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-16 md:top-0 bg-white/80 backdrop-blur-md z-40">
          <div className="flex flex-col">
            <h2 className="text-lg md:text-xl font-serif text-gray-900">Dashboard Overview</h2>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Live Updates
              <span className="text-gray-400 font-normal ml-1">Last synced: {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-gray-100 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#f20c92] w-64 transition-colors placeholder-gray-500"
              />
            </div>
            <button className="relative text-gray-500 hover:text-[#f20c92] transition-colors p-2">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#f20c92] rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatCard 
              title="Total Revenue" 
              value={stats.totalRevenue} 
              change="+12.5%" 
              icon={<DollarSign size={24} className="text-[#f20c92]" />} 
            />
            <StatCard 
              title="Total Orders" 
              value={stats.totalOrders} 
              change="+8.2%" 
              icon={<ShoppingBag size={24} className="text-yellow-600" />} 
            />
            <StatCard 
              title="Active Customers" 
              value={stats.activeCustomers} 
              change="+5.4%" 
              icon={<Users size={24} className="text-emerald-500" />} 
            />
            <StatCard 
              title="Products Sold" 
              value={stats.productsSold} 
              change="+15.3%" 
              icon={<Package size={24} className="text-purple-500" />} 
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-serif text-lg text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <a 
                href="/admin/logo" 
                className="flex-1 md:flex-none inline-flex items-center justify-center px-4 py-2.5 border border-[#f20c92] text-[#f20c92] rounded-xl hover:bg-[#f20c92] hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
              >
                <Bell className="w-4 h-4 mr-2" />
                Update Logo
              </a>
              <a 
                href="/admin/products" 
                className="flex-1 md:flex-none inline-flex items-center justify-center px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-900 hover:text-white transition-all font-bold text-xs uppercase tracking-widest"
              >
                <Package className="w-4 h-4 mr-2" />
                Manage Products
              </a>
            </div>
          </div>

          {/* Recent Orders & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg text-gray-900">Recent Orders</h3>
                <a href="/admin/orders" className="text-[10px] md:text-xs uppercase tracking-widest text-[#f20c92] font-bold hover:text-gray-900 transition-colors">View All</a>
              </div>
              
              <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 no-scrollbar">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200 text-[10px] md:text-xs uppercase tracking-wider text-gray-500">
                      <th className="pb-4 font-bold">Order ID</th>
                      <th className="pb-4 font-bold">Customer</th>
                      <th className="pb-4 font-bold">Product</th>
                      <th className="pb-4 font-bold">Amount</th>
                      <th className="pb-4 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="py-4 font-mono text-xs text-gray-600">#{order.id.slice(-6)}</td>
                        <td className="py-4 font-bold text-gray-900">{order.customer.name}</td>
                        <td className="py-4 text-gray-600 truncate max-w-[150px]">{order.product.name}</td>
                        <td className="py-4 font-bold text-gray-900">{order.product.price}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.status === 'Delivered' || order.status === 'Payment Confirmed'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {recentOrders.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-400">No recent orders found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-serif text-lg text-gray-900 mb-6">Featured Products</h3>
              <div className="space-y-6">
                {topProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 group cursor-pointer">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl border border-gray-200 group-hover:border-[#f20c92]/50 transition-colors overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#f20c92] transition-colors truncate max-w-[120px]">{product.name}</h4>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">{product.category}</p>
                    </div>
                    <span className="text-sm font-black text-yellow-600">
                      {product.currency || '$'}{product.price || product.priceGBP || '0'}
                    </span>
                  </div>
                ))}
                {topProducts.length === 0 && (
                  <p className="py-8 text-center text-gray-400 text-sm">No products found.</p>
                )}
              </div>
              <a href="/admin/products" className="block w-full mt-8 py-3.5 border border-gray-200 rounded-xl text-[10px] uppercase tracking-widest font-black text-gray-600 hover:bg-gray-900 hover:text-white transition-all text-center">
                View Inventory
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, change, icon }: { title: string, value: string, change: string, icon: React.ReactNode }) => (
  <div className="bg-white border border-gray-200 p-6 rounded-2xl hover:border-primary/30 transition-colors group shadow-sm">
    <div className="flex items-start justify-between mb-4">
      <div>
        <p className="text-gray-500 text-xs uppercase tracking-wider font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-primary transition-colors">{value}</h3>
      </div>
      <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 group-hover:border-primary/20 transition-colors">
        {icon}
      </div>
    </div>
    <div className="flex items-center gap-2 text-xs">
      <span className="text-emerald-600 flex items-center gap-1 font-bold">
        <ArrowUpRight size={12} />
        {change}
      </span>
      <span className="text-gray-400">vs last month</span>
    </div>
  </div>
);

export default AdminDashboard;
