import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Mail, 
  MessageCircle, 
  CheckCircle, 
  MoreHorizontal,
  MapPin,
  X,
  Trash2,
  Eye,
  AlertCircle
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { useOrders, Order } from '../context/OrderContext';
import Invoice from './Invoice';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../services/api';
import ConfirmationModal from '../components/ConfirmationModal';

const AdminOrders = () => {
  const { orders, updateOrderStatus, updateOrderShipping, deleteOrder } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const [shippingFee, setShippingFee] = useState('');
  const [shippingCurrency, setShippingCurrency] = useState('£');
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);
  const [emailSettings, setEmailSettings] = useState({
    notificationEmail: 'ogunrinubusayo9@gmail.com',
    invoiceTemplate: 'Dear Customer,\n\nThank you for your order with Cynth Fabrics. Please find your invoice attached below.\n\nBest regards,\nCynth Fabrics Team'
  });

  useEffect(() => {
    const fetchEmailSettings = async () => {
      try {
        const data = await api.getSettings('emailConfig');
        if (data) {
          setEmailSettings(data as any);
        }
      } catch (error) {
        console.error('Error fetching email settings:', error);
      }
    };
    fetchEmailSettings();
  }, []);

  const filteredEnquiries = orders.filter(order => 
    order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateInvoice = async () => {
    if (!selectedOrder) return;
    setIsGeneratingInvoice(true);
    try {
      const productPriceNum = parseFloat(selectedOrder.product.price.replace(/[^0-9.]/g, '')) || 0;
      const subtotal = productPriceNum * (selectedOrder.product.quantity || 1);
      const shippingNum = parseFloat(shippingFee) || 0;
      const total = subtotal + shippingNum;

      const personalizedMessage = emailSettings.invoiceTemplate.replace(/{{customerName}}/g, selectedOrder.customer.name);

      const response = await fetch('/api/invoice/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          customerEmail: selectedOrder.contact.email,
          storeEmail: emailSettings.notificationEmail,
          messageTemplate: personalizedMessage,
          totalAmount: `${shippingCurrency}${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          shippingFee: `${shippingCurrency}${shippingNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          paymentDetails: 'Bank Transfer to Cynth Fabrics Account: 1234567890',
        }),
      });
      const data = await response.json();
      if (data.success) {
        showToast('Invoice generated and sent to customer successfully.', 'success');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      showToast('Failed to generate invoice.', 'error');
    } finally {
      setIsGeneratingInvoice(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    
    const currencyMatch = order.product.price.match(/^[^0-9]+/);
    const defaultCurrency = currencyMatch ? currencyMatch[0].trim() : '£';
    
    setShippingFee(order.shippingFee || '');
    setShippingCurrency(order.shippingCurrency || defaultCurrency);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const handleShippingFeeBlur = async () => {
    if (selectedOrder) {
      try {
        await updateOrderShipping(selectedOrder.id, shippingFee, shippingCurrency);
        setSelectedOrder({ ...selectedOrder, shippingFee, shippingCurrency });
      } catch (error) {
        console.error("Failed to update shipping fee:", error);
      }
    }
  };

  const handleCurrencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCurrency = e.target.value;
    setShippingCurrency(newCurrency);
    if (selectedOrder) {
      try {
        await updateOrderShipping(selectedOrder.id, shippingFee, newCurrency);
        setSelectedOrder({ ...selectedOrder, shippingCurrency: newCurrency });
      } catch (error) {
        console.error("Failed to update currency:", error);
      }
    }
  };

  const handleStatusUpdate = async (newStatus: Order['status']) => {
    if (selectedOrder) {
      try {
        await updateOrderStatus(selectedOrder.id, newStatus);
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      } catch (error) {
        console.error("Failed to update status:", error);
      }
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'New Enquiry':
        return <span className="text-[10px] font-bold uppercase tracking-widest text-[#f20c92] flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#f20c92]"></span> New Enquiry</span>;
      case 'Contacted':
        return <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 flex items-center gap-1"><CheckCircle size={12} /> Contacted</span>;
      case 'Payment Confirmed':
        return <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500 flex items-center gap-1"><CheckCircle size={12} /> Payment Confirmed</span>;
      case 'Delivered':
        return <span className="text-[10px] font-bold uppercase tracking-widest text-green-500 flex items-center gap-1"><CheckCircle size={12} /> Delivered</span>;
      default:
        return <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{status}</span>;
    }
  };

  const productCurrencyMatch = selectedOrder?.product.price.match(/^[^0-9]+/);
  const productCurrency = productCurrencyMatch ? productCurrencyMatch[0].trim() : '£';
  const productPriceNum = selectedOrder ? parseFloat(selectedOrder.product.price.replace(/[^0-9.]/g, '')) : 0;
  const subtotal = productPriceNum * (selectedOrder?.product.quantity || 1);
  const shippingNum = parseFloat(shippingFee) || 0;
  const total = subtotal + shippingNum;

  return (
    <div className="min-h-screen bg-[#f8f5f7] text-[#22101b] font-sans selection:bg-[#f20c92] selection:text-white">
      <AdminSidebar />

      <main className="md:ml-64 min-h-screen bg-gray-50 p-6 md:p-8 lg:p-12 relative pt-20 md:pt-8 lg:pt-12">
        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 md:mb-12">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-tight mb-2 text-gray-900">Order Enquiries</h1>
            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm font-medium">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#f20c92]/10 text-[#f20c92] rounded-full text-xs md:text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f20c92]"></span>
                {orders.filter(o => o.status === 'New Enquiry').length} New Enquiries
              </span>
              <span className="text-gray-500 uppercase tracking-widest text-[10px] md:text-xs">Total: {orders.length} Requests</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-[#f20c92]/20 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#f20c92] focus:border-[#f20c92] text-sm transition-all placeholder-gray-400"
              />
            </div>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#f20c92]/20 rounded-xl hover:border-[#f20c92]/50 transition-all text-sm font-bold text-gray-700">
              <Filter size={18} />
              Filter
            </button>
          </div>
        </header>

        {/* Enquiry Table Section */}
        <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-5 font-bold text-[10px] md:text-xs uppercase tracking-widest text-gray-500">Customer</th>
                  <th className="px-6 py-5 font-bold text-[10px] md:text-xs uppercase tracking-widest text-gray-500">Contact</th>
                  <th className="px-6 py-5 font-bold text-[10px] md:text-xs uppercase tracking-widest text-gray-500">Location</th>
                  <th className="px-6 py-5 font-bold text-[10px] md:text-xs uppercase tracking-widest text-gray-500">Product Interested</th>
                  <th className="px-6 py-5 font-bold text-[10px] md:text-xs uppercase tracking-widest text-gray-500">Size</th>
                  <th className="px-6 py-5 font-bold text-[10px] md:text-xs uppercase tracking-widest text-gray-500">Status</th>
                  <th className="px-6 py-5 font-bold text-[10px] md:text-xs uppercase tracking-widest text-gray-500 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className={`hover:bg-gray-50 transition-colors group ${enquiry.status === 'Delivered' ? 'opacity-60' : ''}`}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${enquiry.status !== 'New Enquiry' ? 'bg-gray-200 text-gray-500' : 'bg-[#f20c92]/10 text-[#f20c92]'}`}>
                          {enquiry.customer.initials}
                        </div>
                        <div>
                          <p className="font-bold text-sm tracking-tight text-gray-900">{enquiry.customer.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">{enquiry.customer.time}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium flex items-center gap-1.5 text-gray-600">
                          <Mail size={12} className="text-[#f20c92]" /> 
                          {enquiry.contact.email}
                        </span>
                        <span className="text-sm font-medium flex items-center gap-1.5 text-gray-600">
                          <MessageCircle size={12} className="text-green-500" /> 
                          {enquiry.contact.phone}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium flex items-center gap-1.5 text-gray-700">
                        <span className="w-5 h-4 bg-gray-800 rounded-sm overflow-hidden flex items-center justify-center text-[10px] text-white">
                          {enquiry.location.code}
                        </span>
                        {enquiry.location.country}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                          <img 
                            className={`w-full h-full object-cover ${enquiry.status === 'Delivered' ? 'opacity-60 grayscale' : ''}`} 
                            src={enquiry.product.image} 
                            alt={enquiry.product.name} 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-sm font-bold max-w-[150px] leading-tight text-gray-900">{enquiry.product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-black tracking-widest text-gray-600">
                        {enquiry.size}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {getStatusDisplay(enquiry.status)}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleViewOrder(enquiry)}
                          className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 hover:text-white transition-all active:scale-95"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button 
                          onClick={() => {
                            setOrderToDelete(enquiry.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100 bg-gray-50">
            <p className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest">Showing <span className="text-gray-900">{filteredEnquiries.length > 0 ? 1 : 0}-{filteredEnquiries.length}</span> of <span className="text-gray-900">{orders.length}</span> entries</p>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-[#f20c92] hover:text-[#f20c92] transition-all">
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f20c92] text-white font-black text-xs shadow-md shadow-[#f20c92]/20">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:border-[#f20c92] hover:text-[#f20c92] transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 md:mt-12">
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-primary/30 transition-colors">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Top Region</p>
            <div className="flex items-end justify-between">
              <h3 className="text-xl md:text-2xl font-serif font-bold tracking-tight text-gray-900">London, UK</h3>
              <span className="text-[#f20c92] text-[10px] font-black bg-[#f20c92]/5 px-2 py-1 rounded-lg uppercase tracking-widest">+12% this week</span>
            </div>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-primary/30 transition-colors">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Avg. Response Time</p>
            <div className="flex items-end justify-between">
              <h3 className="text-xl md:text-2xl font-serif font-bold tracking-tight text-gray-900">4.2 Hours</h3>
              <span className="text-emerald-600 text-[10px] font-black bg-emerald-50 px-2 py-1 rounded-lg uppercase tracking-widest">-0.8h vs last wk</span>
            </div>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-primary/30 transition-colors sm:col-span-2 lg:col-span-1">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Conversion Rate</p>
            <div className="flex items-end justify-between">
              <h3 className="text-xl md:text-2xl font-serif font-bold tracking-tight text-gray-900">28.5%</h3>
              <div className="flex gap-1 items-end h-6">
                <span className="w-1.5 h-3 bg-[#f20c92] rounded-full"></span>
                <span className="w-1.5 h-5 bg-[#f20c92] rounded-full"></span>
                <span className="w-1.5 h-2 bg-[#f20c92] rounded-full"></span>
                <span className="w-1.5 h-4 bg-[#f20c92]/30 rounded-full"></span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col no-scrollbar">
            <div className="flex items-center justify-between p-6 md:p-8 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-md z-10">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-gray-900">Order Details</h2>
              <button 
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 md:p-8 flex-grow">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                {/* Customer Info (Greyed out) */}
                <div className="space-y-6 opacity-80 pointer-events-none">
                  <div>
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Customer Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Full Name</label>
                        <p className="font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-sm">{selectedOrder.customer.name}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Email Address</label>
                        <p className="font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-sm">{selectedOrder.contact.email}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Phone Number</label>
                        <p className="font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-sm">{selectedOrder.contact.phone}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Country</label>
                        <p className="font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-sm">{selectedOrder.location.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Info (Greyed out except shipping) */}
                <div className="space-y-8">
                  <div className="opacity-80 pointer-events-none">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Product Details</h3>
                    <div className="flex gap-4 mb-6">
                      <div className="w-24 h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                        <img src={selectedOrder.product.image} alt={selectedOrder.product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-gray-900 text-lg leading-tight">{selectedOrder.product.name}</p>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">{selectedOrder.product.description || 'Custom tailored piece.'}</p>
                        <p className="text-[#f20c92] font-black mt-3 text-lg">{selectedOrder.product.price}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Size</label>
                        <p className="font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-sm">{selectedOrder.size}</p>
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Color</label>
                        <p className="font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 text-sm">{selectedOrder.color}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Customizations</label>
                      <p className="font-bold text-gray-900 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 min-h-[80px] text-sm leading-relaxed">
                        {selectedOrder.customizations || 'None provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Cost Summary & Editable Shipping Fee */}
                  <div className="pt-8 border-t border-gray-100 mt-8">
                    <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Cost Summary</h3>
                    
                    <div className="space-y-4">
                      {/* Subtotal */}
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                          Subtotal ({selectedOrder.product.quantity}x)
                        </span>
                        <span className="font-bold text-gray-900">
                          {productCurrency}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Shipping Fee */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Shipping Fee</span>
                        <div className="flex items-center gap-2">
                          <select 
                            value={shippingCurrency}
                            onChange={handleCurrencyChange}
                            className="p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f20c92] bg-white text-xs font-black w-20"
                          >
                            <option value="£">£</option>
                            <option value="$">$</option>
                            <option value="₦">₦</option>
                            <option value="€">€</option>
                          </select>
                          <input 
                            type="number" 
                            value={shippingFee}
                            onChange={(e) => setShippingFee(e.target.value)}
                            onBlur={handleShippingFeeBlur}
                            placeholder="0.00"
                            className="w-32 p-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#f20c92] text-right font-black text-gray-900 text-sm"
                          />
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                        <span className="text-sm font-black text-gray-900 uppercase tracking-widest">Total</span>
                        <span className="text-xl font-black text-[#f20c92]">
                          {shippingCurrency}{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Generate Invoice Button */}
                      <div className="pt-6 flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleGenerateInvoice}
                          disabled={isGeneratingInvoice}
                          className="flex-1 py-4 px-6 bg-gray-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-gray-900/20"
                        >
                          <Mail size={16} />
                          {isGeneratingInvoice ? 'SENDING...' : 'SEND INVOICE'}
                        </button>
                        <button
                          onClick={() => setIsInvoicePreviewOpen(true)}
                          className="py-4 px-6 bg-white border border-gray-200 text-gray-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                        >
                          <Eye size={16} />
                          PREVIEW
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progressive Status Buttons */}
            <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-100 sticky bottom-0 z-10">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 text-center">Update Order Status</h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  disabled={selectedOrder.status !== 'New Enquiry'}
                  onClick={() => handleStatusUpdate('Contacted')}
                  className={`flex-1 py-4 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    selectedOrder.status === 'New Enquiry' 
                      ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/30' 
                      : selectedOrder.status === 'Contacted' || selectedOrder.status === 'Payment Confirmed' || selectedOrder.status === 'Delivered'
                        ? 'bg-blue-100 text-blue-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {selectedOrder.status === 'New Enquiry' ? 'MARK CONTACTED' : <><CheckCircle size={16} /> CONTACTED</>}
                </button>
                
                <button 
                  disabled={selectedOrder.status !== 'Contacted'}
                  onClick={() => handleStatusUpdate('Payment Confirmed')}
                  className={`flex-1 py-4 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    selectedOrder.status === 'Contacted' 
                      ? 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/30' 
                      : selectedOrder.status === 'Payment Confirmed' || selectedOrder.status === 'Delivered'
                        ? 'bg-purple-100 text-purple-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {selectedOrder.status === 'Contacted' ? 'CONFIRM PAYMENT' : selectedOrder.status === 'Payment Confirmed' || selectedOrder.status === 'Delivered' ? <><CheckCircle size={16} /> CONFIRMED</> : 'CONFIRM PAYMENT'}
                </button>
                
                <button 
                  disabled={selectedOrder.status !== 'Payment Confirmed'}
                  onClick={() => handleStatusUpdate('Delivered')}
                  className={`flex-1 py-4 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                    selectedOrder.status === 'Payment Confirmed' 
                      ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30' 
                      : selectedOrder.status === 'Delivered'
                        ? 'bg-green-100 text-green-600 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {selectedOrder.status === 'Payment Confirmed' ? 'MARK DELIVERED' : selectedOrder.status === 'Delivered' ? <><CheckCircle size={16} /> DELIVERED</> : 'MARK DELIVERED'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Invoice Preview Modal */}
      {isInvoicePreviewOpen && selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto flex flex-col relative">
            <button
              onClick={() => setIsInvoicePreviewOpen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-full transition-colors z-10"
            >
              <X size={24} />
            </button>
            <Invoice orderId={selectedOrder.id} />
          </div>
        </div>
      )}

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

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setOrderToDelete(null);
        }}
        onConfirm={async () => {
          if (orderToDelete) {
            try {
              await deleteOrder(orderToDelete);
              showToast('Order enquiry deleted successfully.', 'success');
            } catch (error) {
              console.error("Failed to delete order:", error);
              showToast('Failed to delete order enquiry.', 'error');
            }
          }
        }}
        title="Delete Enquiry"
        message="Are you sure you want to delete this order enquiry? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default AdminOrders;
