import React, { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { Save, Mail, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface EmailSettings {
  notificationEmail: string;
  invoiceTemplate: string;
}

const DEFAULT_SETTINGS: EmailSettings = {
  notificationEmail: 'ogunrinubusayo9@gmail.com',
  invoiceTemplate: 'Dear Customer,\n\nThank you for your order with Cynth Fabrics. Please find your invoice attached below.\n\nBest regards,\nCynth Fabrics Team'
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<EmailSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.getSettings('emailConfig');
        if (data) {
          setSettings(data as EmailSettings);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await api.updateSettings('emailConfig', settings);
      
      setToast({ message: 'Settings saved successfully!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setToast({ message: 'Failed to save settings.', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8f5f7] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#f20c92] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5f7] text-[#22101b] font-sans selection:bg-[#f20c92] selection:text-white">
      <AdminSidebar />

      <main className="md:ml-64 min-h-screen p-6 md:p-8 lg:p-12 pt-20 md:pt-8 lg:pt-12">
        <header className="mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight mb-2 text-gray-900">Store Settings</h1>
          <p className="text-gray-500 text-sm">Configure your store's email notifications and invoice templates.</p>
        </header>

        <div className="max-w-3xl">
          <form onSubmit={handleSave} className="space-y-8">
            {/* Email Configuration */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#f20c92]/10 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#f20c92]/10 flex items-center justify-center text-[#f20c92]">
                  <Mail size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Email Notifications</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Notification Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={settings.notificationEmail}
                    onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f20c92]/20 focus:border-[#f20c92] transition-all text-sm"
                    placeholder="e.g. admin@cynthfabrics.com"
                  />
                  <p className="mt-2 text-[10px] text-gray-400 italic">
                    This email will receive notifications for new orders and enquiries.
                  </p>
                </div>
              </div>
            </section>

            {/* Invoice Template */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#f20c92]/10 p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#f20c92]/10 flex items-center justify-center text-[#f20c92]">
                  <FileText size={20} />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Invoice Template</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Message Template (Precedes Invoice)
                  </label>
                  <textarea
                    required
                    rows={6}
                    value={settings.invoiceTemplate}
                    onChange={(e) => setSettings({ ...settings, invoiceTemplate: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f20c92]/20 focus:border-[#f20c92] transition-all text-sm resize-none"
                    placeholder="Write the message that will be sent to customers with their invoice..."
                  />
                  <p className="mt-2 text-[10px] text-gray-400 italic">
                    Use <span className="font-bold text-[#f20c92]">{"{{customerName}}"}</span> as a placeholder to automatically include the customer's name.
                  </p>
                  <p className="mt-1 text-[10px] text-gray-400 italic">
                    This message will be included in the email sent to customers when you generate an invoice.
                  </p>
                </div>
              </div>
            </section>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2 px-8 py-3 bg-[#f20c92] text-white rounded-xl font-bold hover:bg-[#d10a7d] transition-all shadow-lg shadow-[#f20c92]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Save Settings
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>

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
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-bold tracking-wide">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
