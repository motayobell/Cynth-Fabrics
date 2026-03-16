import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  TrendingUp, 
  Package,
  Shield,
  FileText
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const [user, setUser] = React.useState({ name: 'Cynthia A.', role: 'Super Admin' });

  React.useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        name: parsedUser.name || 'Cynthia A.',
        role: parsedUser.role || 'Super Admin'
      });
    }
  }, []);

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 hidden md:flex flex-col">
      <div className="p-8 border-b border-gray-200">
        <h1 className="font-serif text-2xl text-yellow-600 font-bold tracking-tighter">CYNTH<br/>ADMIN</h1>
      </div>
      
      <nav className="flex-1 p-6 space-y-2">
        <NavItem 
          to="/admin/dashboard" 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
          active={location.pathname === '/admin/dashboard'} 
        />
        <NavItem 
          to="/admin/orders" 
          icon={<ShoppingBag size={20} />} 
          label="Orders" 
          active={location.pathname === '/admin/orders'} 
        />
        <NavItem 
          to="/admin/products" 
          icon={<Package size={20} />} 
          label="Products" 
          active={location.pathname === '/admin/products'} 
        />
        <NavItem 
          to="/admin/content" 
          icon={<FileText size={20} />} 
          label="Content Manager" 
          active={location.pathname === '/admin/content'} 
        />
        <NavItem 
          to="/admin/customers" 
          icon={<Users size={20} />} 
          label="Customers" 
          active={location.pathname === '/admin/customers'} 
        />
        <NavItem 
          to="/admin/users" 
          icon={<Shield size={20} />} 
          label="Admin Users" 
          active={location.pathname === '/admin/users'} 
        />
        <NavItem 
          to="/admin/analytics" 
          icon={<TrendingUp size={20} />} 
          label="Analytics" 
          active={location.pathname === '/admin/analytics'} 
        />
        <NavItem 
          to="/admin/settings" 
          icon={<Settings size={20} />} 
          label="Settings" 
          active={location.pathname === '/admin/settings'} 
        />
      </nav>

      <div className="p-6 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f20c92]/10 flex items-center justify-center text-[#f20c92] font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

const NavItem = ({ icon, label, active = false, to }: { icon: React.ReactNode, label: string, active?: boolean, to: string }) => (
  <Link 
    to={to} 
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-[#f20c92] text-white shadow-md shadow-[#f20c92]/20' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </Link>
);

export default AdminSidebar;
