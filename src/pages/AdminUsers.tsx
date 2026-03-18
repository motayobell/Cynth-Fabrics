import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Plus, 
  Trash2, 
  Edit2, 
  Shield, 
  Check, 
  X,
  MoreVertical
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'Super Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Inactive';
  lastLogin: string;
}

const initialAdmins: AdminUser[] = [
  {
    id: '1',
    name: 'Cynthia A.',
    email: 'cynthia@cynthfabrics.com',
    role: 'Super Admin',
    status: 'Active',
    lastLogin: 'Just now'
  },
  {
    id: '2',
    name: 'Oluwaseun B.',
    email: 'oluwaseun@cynthfabrics.com',
    role: 'Editor',
    status: 'Active',
    lastLogin: '2 hours ago'
  }
];

import { db, auth } from '../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, query, serverTimestamp } from 'firebase/firestore';

const AdminUsers = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'Editor' });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'users'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // Seed initial data if empty and user is likely an admin
        if (auth.currentUser) {
          seedInitialData();
        } else {
          setAdmins(initialAdmins);
        }
      } else {
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AdminUser[];
        setAdmins(usersData);
      }
    }, (error) => {
      // Fallback to local data if offline or permission denied
      const storedAdmins = localStorage.getItem('adminUsers');
      if (storedAdmins) {
        setAdmins(JSON.parse(storedAdmins));
      } else {
        setAdmins(initialAdmins);
      }
    });

    return () => unsubscribe();
  }, []);

  const seedInitialData = async () => {
    try {
      for (const admin of initialAdmins) {
        const docRef = doc(collection(db, 'users'), String(admin.id));
        await setDoc(docRef, {
          ...admin,
          createdAt: serverTimestamp()
        });
      }
    } catch (error) {
      // If seeding fails (e.g., due to permissions), fallback to local data
      const storedAdmins = localStorage.getItem('adminUsers');
      if (storedAdmins) {
        setAdmins(JSON.parse(storedAdmins));
      } else {
        setAdmins(initialAdmins);
      }
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const adminId = Date.now().toString();
    const admin: AdminUser = {
      id: adminId,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role as any,
      status: 'Active',
      lastLogin: 'Never'
    };
    
    try {
      const docRef = doc(collection(db, 'users'), adminId);
      await setDoc(docRef, {
        ...admin,
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      setNewAdmin({ name: '', email: '', role: 'Editor' });
    } catch (error) {
      console.error("Error adding admin:", error);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    // In a real app, use a custom modal. For this demo, we'll just delete it directly
    // since window.confirm is blocked in the iframe.
    try {
      await deleteDoc(doc(db, 'users', id));
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-[#f20c92] selection:text-white">
      <AdminSidebar />

      <main className="md:ml-64 min-h-screen bg-gray-50 relative">
        {/* Header */}
        <header className="h-20 border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 bg-white/80 backdrop-blur-md z-40">
          <h2 className="text-xl font-serif text-gray-900">Admin Management</h2>
          
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search admins..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-100 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#f20c92] w-64 transition-colors placeholder-gray-500"
              />
            </div>
            <button className="relative text-gray-500 hover:text-[#f20c92] transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#f20c92] rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2 text-gray-900">Team Members</h1>
              <p className="text-gray-500 text-sm">Manage access and roles for your dashboard.</p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-[#f20c92] hover:bg-[#f20c92]/90 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-md shadow-[#f20c92]/20"
            >
              <Plus size={18} />
              Add New User
            </button>
          </div>

          {/* Admins Table */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                  <th className="px-6 py-4 font-medium">User</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Last Login</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAdmins.map((admin) => (
                  <tr key={admin.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm">
                          {admin.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{admin.name}</p>
                          <p className="text-xs text-gray-500">{admin.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                        admin.role === 'Super Admin' 
                          ? 'bg-purple-100 text-purple-700 border-purple-200' 
                          : 'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                        <Shield size={10} />
                        {admin.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        admin.status === 'Active' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {admin.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                      {admin.lastLogin}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors">
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteAdmin(admin.id)}
                          className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredAdmins.length === 0 && (
              <div className="p-12 text-center text-gray-400">
                <p>No admins found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-bold text-gray-900">Add New User</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-[#f20c92] focus:ring-1 focus:ring-[#f20c92] transition-all placeholder-gray-400"
                  placeholder="e.g. John Doe"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-[#f20c92] focus:ring-1 focus:ring-[#f20c92] transition-all placeholder-gray-400"
                  placeholder="admin@cynthfabrics.com"
                />
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Role</label>
                <select 
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:border-[#f20c92] focus:ring-1 focus:ring-[#f20c92] transition-all appearance-none"
                >
                  <option value="Editor">Editor</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              
              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#f20c92] hover:bg-[#f20c92]/90 text-white rounded-xl font-medium shadow-md shadow-[#f20c92]/20 transition-all"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
