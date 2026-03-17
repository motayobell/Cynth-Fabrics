import React, { useState } from 'react';
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
  Eye
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import { useOrders, Order } from '../context/OrderContext';
import Invoice from './Invoice';

const AdminOrders = () => {
  const { orders, updateOrderStatus, updateOrderShipping, deleteOrder } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoicePreviewOpen, setIsInvoicePreviewOpen] = useState(false);
  const [shippingFee, setShippingFee] = useState('');
  const [shippingCurrency, setShippingCurrency] = useState('£');
  const [isGeneratingInvoice, setIsGeneratingInvoice] = useState(false);

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

      const response = await fetch('/api/invoice/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          customerEmail: selectedOrder.contact.email,
          totalAmount: `${shippingCurrency}${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          shippingFee: `${shippingCurrency}${shippingNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          paymentDetails: 'Bank Transfer to Cynth Fabrics Account: 1234567890',
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert('Invoice generated and sent to customer successfully.');
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice.');
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

      <main className="md:ml-64 min-h-screen bg-gray-50 p-8 lg:p-12 relative">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-serif font-bold tracking-tight mb-2 text-gray-900">Order Enquiries</h1>
            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-[#f20c92]/10 text-[#f20c92] rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f20c92]"></span>
                {orders.filter(o => o.status === 'New Enquiry').length} New Enquiries
              </span>
              <span className="text-gray-500 uppercase tracking-widest text-xs">Total: {orders.length} Requests</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search customer or product..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-[#f20c92]/20 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f20c92] focus:border-[#f20c92] text-sm w-64 transition-all placeholder-gray-400"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#f20c92]/20 rounded-lg hover:border-[#f20c92]/50 transition-all text-sm font-semibold text-gray-700">
              <Filter size={18} />
              Filter
            </button>
          </div>
        </header>

        {/* Enquiry Table Section */}
        <section className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="px-6 py-5 font-bold text-xs uppercase tracking-widest text-gray-500">Customer</th>
                  <th className="px-6 py-5 font-bold text-xs uppercase tracking-widest text-gray-500">Contact</th>
                  <th className="px-6 py-5 font-bold text-xs uppercase tracking-widest text-gray-500">Location</th>
                  <th className="px-6 py-5 font-bold text-xs uppercase tracking-widest text-gray-500">Product Interested</th>
                  <th className="px-6 py-5 font-bold text-xs uppercase tracking-widest text-gray-500">Size</th>
                  <th className="px-6 py-5 font-bold text-xs uppercase tracking-widest text-gray-500">Status</th>
                  <th className="px-6 py-5 font-bold text-xs uppercase tracking-widest text-gray-500 text-right">Action</th>
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
                          <p className="text-xs text-gray-500">{enquiry.customer.time}</p>
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
                        <div className="w-12 h-14 bg-gray-100 rounded-md overflow-hidden shrink-0 border border-gray-200">
                          <img 
                            className={`w-full h-full object-cover ${enquiry.status === 'Delivered' ? 'opacity-60 grayscale' : ''}`} 
                            src={enquiry.product.image} 
                            alt={enquiry.product.name} 
                          />
                        </div>
                        <span className="text-sm font-bold max-w-[150px] leading-tight text-gray-900">{enquiry.product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-2 py-1 bg-gray-100 rounded text-[10px] font-bold tracking-widest text-gray-600">
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
                          className="flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-200 transition-all"
                        >
                          <Eye size={14} /> View
                        </button>
                        <button 
                          onClick={async () => {
                            try {
                              await deleteOrder(enquiry.id);
                            } catch (error) {
                              console.error("Failed to delete order:", error);
                            }
                          }}
                          className="flex items-center gap-1 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition-all"
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
          <div className="px-6 py-5 flex items-center justify-between border-t border-gray-100 bg-gray-50">
            <p className="text-xs font-medium text-gray-500">Showing <span className="font-bold text-gray-900">{filteredEnquiries.length > 0 ? 1 : 0}-{filteredEnquiries.length}</span> of <span className="font-bold text-gray-900">{orders.length}</span> entries</p>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:border-[#f20c92] hover:text-[#f20c92] transition-all">
                <ChevronLeft size={16} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded bg-[#f20c92] text-white font-bold text-xs shadow-md shadow-[#f20c92]/20">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:border-[#f20c92] hover:text-[#f20c92] transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Top Region</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-serif font-bold tracking-tight text-gray-900">London, UK</h3>
              <span className="text-[#f20c92] text-sm font-bold bg-[#f20c92]/5 px-2 py-1 rounded-lg">+12% this week</span>
            </div>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Avg. Response Time</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-serif font-bold tracking-tight text-gray-900">4.2 Hours</h3>
              <span className="text-emerald-600 text-sm font-bold bg-emerald-50 px-2 py-1 rounded-lg">-0.8h vs last wk</span>
            </div>
          </div>
          <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Conversion Rate</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl font-serif font-bold tracking-tight text-gray-900">28.5%</h3>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-2xl font-serif font-bold text-gray-900">Order Details</h2>
              <button 
                onClick={closeModal}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Customer Info (Greyed out) */}
                <div className="space-y-6 opacity-80 pointer-events-none">
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Customer Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500">Full Name</label>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded border border-gray-100">{selectedOrder.customer.name}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Email Address</label>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded border border-gray-100">{selectedOrder.contact.email}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Phone Number</label>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded border border-gray-100">{selectedOrder.contact.phone}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Country</label>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded border border-gray-100">{selectedOrder.location.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Info (Greyed out except shipping) */}
                <div className="space-y-6">
                  <div className="opacity-80 pointer-events-none">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Product Details</h3>
                    <div className="flex gap-4 mb-4">
                      <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                        <img src={selectedOrder.product.image} alt={selectedOrder.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-gray-900">{selectedOrder.product.name}</p>
                        <p className="text-sm text-gray-600">{selectedOrder.product.description || 'Custom tailored piece.'}</p>
                        <p className="text-[#f20c92] font-bold mt-2">{selectedOrder.product.price}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="text-xs text-gray-500">Size</label>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded border border-gray-100">{selectedOrder.size}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Color</label>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded border border-gray-100">{selectedOrder.color}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Quantity</label>
                        <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded border border-gray-100">{selectedOrder.product.quantity}</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500">Customizations</label>
                      <p className="font-medium text-gray-900 bg-gray-50 p-2 rounded border border-gray-100 min-h-[60px]">
                        {selectedOrder.customizations || 'None provided.'}
                      </p>
                    </div>
                  </div>

                  {/* Cost Summary & Editable Shipping Fee */}
                  <div className="pt-6 border-t border-gray-100 mt-6">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Cost Summary</h3>
                    
                    <div className="space-y-4">
                      {/* Subtotal */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          Subtotal ({selectedOrder.product.quantity}x {productCurrency}{productPriceNum.toLocaleString()})
                        </span>
                        <div className="w-1/2 max-w-[220px] text-right pr-3">
                          <span className="font-medium text-gray-900">
                            {productCurrency}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      {/* Shipping Fee */}
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Shipping Fee</span>
                        <div className="flex items-center gap-2 w-1/2 max-w-[220px]">
                          <select 
                            value={shippingCurrency}
                            onChange={handleCurrencyChange}
                            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f20c92] bg-white text-sm font-medium w-20"
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
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f20c92] text-right font-medium text-gray-900 text-sm"
                          />
                        </div>
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                        <span className="text-base font-bold text-gray-900">Total</span>
                        <div className="w-1/2 max-w-[220px] text-right pr-3">
                          <span className="text-lg font-bold text-[#f20c92]">
                            {shippingCurrency}{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>

                      {/* Generate Invoice Button */}
                      <div className="pt-4 flex gap-3">
                        <button
                          onClick={handleGenerateInvoice}
                          disabled={isGeneratingInvoice}
                          className="flex-1 py-3 px-4 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          <Mail size={16} />
                          {isGeneratingInvoice ? 'GENERATING & SENDING...' : 'GENERATE & SEND INVOICE'}
                        </button>
                        <button
                          onClick={() => setIsInvoicePreviewOpen(true)}
                          className="py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
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
            <div className="p-6 bg-gray-50 border-t border-gray-100 sticky bottom-0 z-10">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 text-center">Update Order Status</h3>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                  disabled={selectedOrder.status !== 'New Enquiry'}
                  onClick={() => handleStatusUpdate('Contacted')}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
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
                  className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    selectedOrder.status === 'Contacted' 
                      ? 'bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/30' 
                      : selectedOrder.status === 'Payment Confirmed' || selectedOrder.status === 'Delivered'
                        ? 'bg-purple-100 text-purple-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {selectedOrder.status === 'Contacted' ? 'CONFIRM PAYMENT' : selectedOrder.status === 'Payment Confirmed' || selectedOrder.status === 'Delivered' ? <><CheckCircle size={16} /> PAYMENT CONFIRMED</> : 'PAYMENT CONFIRMED'}
                </button>
                
                <button 
                  disabled={selectedOrder.status !== 'Payment Confirmed'}
                  onClick={() => handleStatusUpdate('Delivered')}
                  className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    selectedOrder.status === 'Payment Confirmed' 
                      ? 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/30' 
                      : selectedOrder.status === 'Delivered'
                        ? 'bg-green-100 text-green-600 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {selectedOrder.status === 'Payment Confirmed' ? 'MARK DELIVERED' : selectedOrder.status === 'Delivered' ? <><CheckCircle size={16} /> DELIVERED</> : 'DELIVERED'}
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
    </div>
  );
};

export default AdminOrders;
