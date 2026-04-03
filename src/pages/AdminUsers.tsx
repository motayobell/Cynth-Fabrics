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
  MoreVertical,
  AlertCircle,
  CheckCircle
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
import ConfirmationModal from '../components/ConfirmationModal';
import { motion, AnimatePresence } from 'framer-motion';

const AdminUsers = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', role: 'Editor', password: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

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
    
    try {
      if (editingAdmin) {
        // Update existing admin
        const docRef = doc(db, 'users', editingAdmin.id);
        const updatedData = {
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role as any,
          password: newAdmin.password || (editingAdmin as any).password || ''
        };
        await setDoc(docRef, updatedData, { merge: true });
        setIsModalOpen(false);
        setEditingAdmin(null);
        setNewAdmin({ name: '', email: '', role: 'Editor', password: '' });
      } else {
        // Add new admin
        const adminId = Date.now().toString();
        const admin: AdminUser & { password?: string } = {
          id: adminId,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role as any,
          status: 'Active',
          lastLogin: 'Never',
          password: newAdmin.password
        };
        
        const docRef = doc(collection(db, 'users'), adminId);
        await setDoc(docRef, {
          ...admin,
          createdAt: serverTimestamp()
        });
        setGeneratedPassword(newAdmin.password);
        setIsModalOpen(false);
        setNewAdmin({ name: '', email: '', role: 'Editor', password: '' });
      }
    } catch (error) {
      console.error("Error saving admin:", error);
    }
  };

  const handleEditClick = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setNewAdmin({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      password: (admin as any).password || ''
    });
    setIsModalOpen(true);
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

      <main className="md:ml-64 min-h-screen bg-gray-50 relative pb-20 md:pb-0 pt-16 md:pt-0">
        {/* Header */}
        <header className="h-16 md:h-20 border-b border-gray-200 flex items-center justify-between px-4 md:px-8 sticky top-16 md:top-0 bg-white/80 backdrop-blur-md z-40">
          <h2 className="text-lg md:text-xl font-serif text-gray-900">Admin Management</h2>
          
          <div className="flex items-center gap-3 md:gap-6">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search admins..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-100 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm text-gray-900 focus:outline-none focus:border-[#f20c92] w-64 transition-colors placeholder-gray-500"
              />
            </div>
            <button className="relative text-gray-500 hover:text-[#f20c92] transition-colors p-2">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#f20c92] rounded-full"></span>
            </button>
          </div>
        </header>

        <div className="p-4 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold mb-1 md:mb-2 text-gray-900">Team Members</h1>
              <p className="text-gray-500 text-xs md:text-sm">Manage access and roles for your dashboard.</p>
            </div>
            <div className="flex flex-wrap gap-2 md:gap-3">
              <div className="relative flex-1 md:hidden">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#f20c92] shadow-sm"
                />
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex-1 md:flex-none bg-[#f20c92] hover:bg-[#f20c92]/90 text-white px-4 md:px-6 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-medium flex items-center justify-center gap-2 transition-all shadow-md shadow-[#f20c92]/20"
              >
                <Plus size={16} className="md:w-[18px] md:h-[18px]" />
                <span className="hidden sm:inline">Add New User</span>
                <span className="sm:hidden">Add User</span>
              </button>
            </div>
          </div>

          {/* Admins Table */}
          <div className="bg-white border border-gray-200 rounded-xl md:rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px] md:min-w-full">
                <thead>
                  <tr className="border-b border-gray-200 text-[10px] md:text-xs uppercase tracking-wider text-gray-500 bg-gray-50">
                    <th className="px-4 md:px-6 py-3 md:py-4 font-medium">User</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 font-medium">Role</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 font-medium">Status</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 font-medium">Last Login</th>
                    <th className="px-4 md:px-6 py-3 md:py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-200 flex items-center justify-center text-gray-700 font-bold text-xs md:text-sm flex-shrink-0">
                            {admin.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 text-sm md:text-base truncate">{admin.name}</p>
                            <p className="text-[10px] md:text-xs text-gray-500 truncate">{admin.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className={`inline-flex items-center gap-1 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium border ${
                          admin.role === 'Super Admin' 
                            ? 'bg-purple-100 text-purple-700 border-purple-200' 
                            : 'bg-blue-100 text-blue-700 border-blue-200'
                        }`}>
                          <Shield size={10} />
                          {admin.role}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <span className={`inline-flex items-center px-2 md:px-2.5 py-0.5 md:py-1 rounded-full text-[10px] md:text-xs font-medium ${
                          admin.status === 'Active' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-sm text-gray-500 font-mono">
                        {admin.lastLogin}
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-right">
                        <div className="flex items-center justify-end gap-1 md:gap-2">
                          <button 
                            onClick={() => handleEditClick(admin)}
                            className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors active:scale-95"
                          >
                            <Edit2 size={14} className="md:w-4 md:h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setAdminToDelete(admin.id);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 md:p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-colors active:scale-95"
                          >
                            <Trash2 size={14} className="md:w-4 md:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filteredAdmins.length === 0 && (
              <div className="p-12 text-center text-gray-400">
                <p className="text-sm">No admins found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Admin Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-0 sm:p-4">
          <div className="bg-white border-t sm:border border-gray-200 rounded-t-2xl sm:rounded-2xl w-full max-w-md p-4 md:p-6 shadow-2xl mt-auto sm:mt-0">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-serif font-bold text-gray-900">
                {editingAdmin ? 'Edit User' : 'Add New User'}
              </h3>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingAdmin(null);
                  setNewAdmin({ name: '', email: '', role: 'Editor', password: '' });
                }}
                className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-900 focus:outline-none focus:border-[#f20c92] focus:ring-1 focus:ring-[#f20c92] transition-all placeholder-gray-400"
                  placeholder="e.g. John Doe"
                />
              </div>
              
              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-900 focus:outline-none focus:border-[#f20c92] focus:ring-1 focus:ring-[#f20c92] transition-all placeholder-gray-400"
                  placeholder="admin@cynthfabrics.com"
                />
              </div>
              
              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Temporary Password</label>
                <input 
                  type="text" 
                  required
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-900 focus:outline-none focus:border-[#f20c92] focus:ring-1 focus:ring-[#f20c92] transition-all placeholder-gray-400"
                  placeholder="Set a temporary password"
                />
                <p className="mt-1 text-[10px] text-gray-400 italic">Share this password with the new admin for their first login.</p>
              </div>
              
              <div>
                <label className="block text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">Role</label>
                <select 
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-900 focus:outline-none focus:border-[#f20c92] focus:ring-1 focus:ring-[#f20c92] transition-all appearance-none"
                >
                  <option value="Editor">Editor</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </div>
              
              <div className="pt-2 md:pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingAdmin(null);
                    setNewAdmin({ name: '', email: '', role: 'Editor', password: '' });
                  }}
                  className="flex-1 py-2.5 md:py-3 border border-gray-200 rounded-xl font-medium text-sm md:text-base text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 md:py-3 bg-[#f20c92] hover:bg-[#f20c92]/90 text-white rounded-xl font-medium text-sm md:text-base shadow-md shadow-[#f20c92]/20 transition-all"
                >
                  {editingAdmin ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Success Modal for New User */}
      {generatedPassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} />
            </div>
            <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">User Added Successfully</h3>
            <p className="text-gray-500 text-sm mb-6">Please share these credentials with the new admin:</p>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6 text-left space-y-2">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Email</p>
                <p className="text-sm font-medium text-gray-900">{admins.find(a => a.lastLogin === 'Never')?.email}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Password</p>
                <p className="text-sm font-mono font-bold text-[#f20c92]">{generatedPassword}</p>
              </div>
            </div>
            
            <button 
              onClick={() => setGeneratedPassword('')}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-[0.98]"
            >
              Done
            </button>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAdminToDelete(null);
        }}
        onConfirm={async () => {
          if (adminToDelete) {
            try {
              await deleteDoc(doc(db, 'users', adminToDelete));
              showToast('Admin user deleted successfully.', 'success');
            } catch (error) {
              console.error("Error deleting admin:", error);
              showToast('Failed to delete admin user.', 'error');
            }
          }
        }}
        title="Delete Admin"
        message="Are you sure you want to delete this admin user? They will lose all access to the dashboard."
        confirmText="Delete"
        type="danger"
      />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md border ${
              toast.type === 'success' 
                ? 'bg-emerald-500/90 border-emerald-400 text-white' 
                : 'bg-red-500/90 border-red-400 text-white'
            }`}
          >
            {toast.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-bold tracking-wide">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsers;
