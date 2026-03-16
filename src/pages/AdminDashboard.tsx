import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  Package,
  ArrowUpRight,
  Search,
  Bell
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-primary selection:text-white">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="md:ml-64 min-h-screen bg-gray-50 relative">
        {/* Header */}
        <header className="h-20 border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 bg-white/80 backdrop-blur-md z-40">
          <h2 className="text-xl font-serif text-gray-900">Dashboard Overview</h2>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-gray-100 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-primary w-64 transition-colors placeholder-gray-500"
              />
            </div>
            <button className="relative text-gray-500 hover:text-primary transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Revenue" 
              value="$124,592" 
              change="+12.5%" 
              icon={<DollarSign size={24} className="text-primary" />} 
            />
            <StatCard 
              title="Total Orders" 
              value="1,459" 
              change="+8.2%" 
              icon={<ShoppingBag size={24} className="text-gold" />} 
            />
            <StatCard 
              title="Active Customers" 
              value="892" 
              change="+5.4%" 
              icon={<Users size={24} className="text-emerald-500" />} 
            />
            <StatCard 
              title="Products Sold" 
              value="3,240" 
              change="+15.3%" 
              icon={<Package size={24} className="text-purple-500" />} 
            />
          </div>

          {/* Recent Orders & Top Products */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif text-lg text-gray-900">Recent Orders</h3>
                <button className="text-xs uppercase tracking-widest text-primary font-bold hover:text-gray-900 transition-colors">View All</button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                      <th className="pb-4 font-medium">Order ID</th>
                      <th className="pb-4 font-medium">Customer</th>
                      <th className="pb-4 font-medium">Product</th>
                      <th className="pb-4 font-medium">Amount</th>
                      <th className="pb-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                        <td className="py-4 font-mono text-gray-600">#ORD-00{i}</td>
                        <td className="py-4 font-medium text-gray-900">Oluwaseun A.</td>
                        <td className="py-4 text-gray-600">Heritage Silk...</td>
                        <td className="py-4 font-medium text-gray-900">$340.00</td>
                        <td className="py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            Completed
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="font-serif text-lg text-gray-900 mb-6">Top Products</h3>
              <div className="space-y-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 group-hover:border-primary/50 transition-colors"></div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors">Royal Aso Oke</h4>
                      <p className="text-xs text-gray-500">24 sales this week</p>
                    </div>
                    <span className="text-sm font-bold text-yellow-600">$450</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-3 border border-gray-200 rounded-xl text-xs uppercase tracking-widest font-bold text-gray-600 hover:bg-gray-900 hover:text-white transition-all">
                View Inventory
              </button>
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
