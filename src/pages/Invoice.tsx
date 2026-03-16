import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useOrders } from '../context/OrderContext';
import { Phone, Mail, Globe, MessageCircle, Building2 } from 'lucide-react';

interface InvoiceProps {
  orderId?: string;
}

export default function Invoice({ orderId: propOrderId }: InvoiceProps = {}) {
  const { id: paramId } = useParams();
  const { orders } = useOrders();
  
  const id = propOrderId || paramId;
  const order = orders.find(o => o.id === id);
  
  if (!order) {
    return <Navigate to="/admin/orders" />;
  }

  const productCurrencyMatch = order.product.price.match(/^[^0-9]+/);
  const currency = order.shippingCurrency || (productCurrencyMatch ? productCurrencyMatch[0].trim() : '£');
  const productPriceNum = parseFloat(order.product.price.replace(/[^0-9.]/g, '')) || 0;
  const subtotal = productPriceNum * (order.product.quantity || 1);
  const shippingNum = parseFloat(order.shippingFee || '0') || 0;
  const total = subtotal + shippingNum;

  const issueDate = new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const dueDate = new Date(new Date(order.date).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-[#f8f5f7] font-sans text-slate-900 w-full">
      <div className="relative flex w-full flex-col overflow-x-hidden">
        <div className="flex grow flex-col">
          <div className="px-6 md:px-10 flex flex-1 justify-center py-10">
            <div className="flex flex-col max-w-[960px] flex-1 bg-white p-10 md:p-16 rounded-2xl shadow-sm border border-slate-100">
              {/* Branded Header */}
              <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-200 pb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 text-[#f20c92]">
                    <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                      <path d="M39.5563 34.1455V13.8546C39.5563 15.708 36.8773 17.3437 32.7927 18.3189C30.2914 18.916 27.263 19.2655 24 19.2655C20.737 19.2655 17.7086 18.916 15.2073 18.3189C11.1227 17.3437 8.44365 15.708 8.44365 13.8546V34.1455C8.44365 35.9988 11.1227 37.6346 15.2073 38.6098C17.7086 39.2069 20.737 39.5564 24 39.5564C27.1288 39.5564 30.2914 39.2069 32.7927 38.6098C36.8773 37.6346 39.5563 35.9988 39.5563 34.1455Z" fill="currentColor"></path>
                      <path clipRule="evenodd" d="M10.4485 13.8519C10.4749 13.9271 10.6203 14.246 11.379 14.7361C12.298 15.3298 13.7492 15.9145 15.6717 16.3735C18.0007 16.9296 20.8712 17.2655 24 17.2655C27.1288 17.2655 29.9993 16.9296 32.3283 16.3735C34.2508 15.9145 35.702 15.3298 36.621 14.7361C37.3796 14.246 37.5251 13.9271 37.5515 13.8519C37.5287 13.7876 37.4333 13.5973 37.0635 13.2931C36.5266 12.8516 35.6288 12.3647 34.343 11.9175C31.79 11.0295 28.1333 10.4437 24 10.4437C19.8667 10.4437 16.2099 11.0295 13.657 11.9175C12.3712 12.3647 11.4734 12.8516 10.9365 13.2931C10.5667 13.5973 10.4713 13.7876 10.4485 13.8519ZM37.5563 18.7877C36.3176 19.3925 34.8502 19.8839 33.2571 20.2642C30.5836 20.9025 27.3973 21.2655 24 21.2655C20.6027 21.2655 17.4164 20.9025 14.7429 20.2642C13.1498 19.8839 11.6824 19.3925 10.4436 18.7877V34.1275C10.4515 34.1545 10.5427 34.4867 11.379 35.027C12.298 35.6207 13.7492 36.2054 15.6717 36.6644C18.0007 37.2205 20.8712 37.5564 24 37.5564C27.1288 37.5564 29.9993 37.2205 32.3283 36.6644C34.2508 36.2054 35.702 35.6207 36.621 35.027C37.4573 34.4867 37.5485 34.1546 37.5563 34.1275V18.7877ZM41.5563 13.8546V34.1455C41.5563 36.1078 40.158 37.5042 38.7915 38.3869C37.3498 39.3182 35.4192 40.0389 33.2571 40.5551C30.5836 41.1934 27.3973 41.5564 24 41.5564C20.6027 41.5564 17.4164 41.1934 14.7429 40.5551C12.5808 40.0389 10.6502 39.3182 9.20848 38.3869C7.84205 37.5042 6.44365 36.1078 6.44365 34.1455L6.44365 13.8546C6.44365 12.2684 7.37223 11.0454 8.39581 10.2036C9.43325 9.3505 10.8137 8.67141 12.343 8.13948C15.4203 7.06909 19.5418 6.44366 24 6.44366C28.4582 6.44366 32.5797 7.06909 35.657 8.13948C37.1863 8.67141 38.5667 9.3505 39.6042 10.2036C40.6278 11.0454 41.5563 12.2684 41.5563 13.8546Z" fill="currentColor" fillRule="evenodd"></path>
                    </svg>
                  </div>
                  <h2 className="text-[#B89000] text-2xl font-bold leading-tight tracking-tight">Cynth Fabrics</h2>
                </div>
                <div className="text-left md:text-right">
                  <h1 className="text-[#f20c92] text-3xl font-black tracking-tighter uppercase italic">Invoice</h1>
                  <p className="text-slate-500 text-sm mt-1">#INV-{new Date(order.date).getFullYear()}-{order.id.substring(0, 4).toUpperCase()}</p>
                </div>
              </header>

              {/* Invoice Info & Bill To */}
              <div className="flex flex-col md:flex-row justify-between gap-10 py-10">
                <div className="flex-1">
                  <h3 className="text-[#B89000] text-xs font-bold uppercase tracking-widest mb-3">Bill To</h3>
                  <div className="space-y-1">
                    <p className="text-xl font-bold text-slate-900">{order.customer.name}</p>
                    <p className="text-slate-600 leading-relaxed max-w-xs">
                      {order.contact.email}<br/>
                      {order.contact.phone}<br/>
                      {order.location.country}
                    </p>
                  </div>
                </div>
                <div className="flex-none text-left md:text-right space-y-4">
                  <div>
                    <p className="text-[#B89000] text-xs font-bold uppercase tracking-widest">Issue Date</p>
                    <p className="text-slate-900 font-medium">{issueDate}</p>
                  </div>
                  <div>
                    <p className="text-[#B89000] text-xs font-bold uppercase tracking-widest">Due Date</p>
                    <p className="text-slate-900 font-medium">{dueDate}</p>
                  </div>
                </div>
              </div>

              {/* Order Details Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="py-4 px-2 text-[#B89000] text-xs font-bold uppercase tracking-widest">Item Description</th>
                      <th className="py-4 px-2 text-[#B89000] text-xs font-bold uppercase tracking-widest text-center">Qty</th>
                      <th className="py-4 px-2 text-[#B89000] text-xs font-bold uppercase tracking-widest text-right">Price</th>
                      <th className="py-4 px-2 text-[#B89000] text-xs font-bold uppercase tracking-widest text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-6 px-2">
                        <p className="font-bold text-slate-900">{order.product.name}</p>
                        <p className="text-slate-500 text-sm italic">Size: {order.size}</p>
                      </td>
                      <td className="py-6 px-2 text-center text-slate-700">{order.product.quantity || 1}</td>
                      <td className="py-6 px-2 text-right text-slate-700">{currency}{productPriceNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td className="py-6 px-2 text-right text-slate-900 font-medium">{currency}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Financial Breakdown */}
              <div className="flex justify-end pt-10 pb-12">
                <div className="w-full md:w-1/2 space-y-4">
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Subtotal</span>
                    <span>{currency}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center text-slate-600">
                    <span>Shipping Fee</span>
                    <span>{currency}{shippingNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between items-center border-t border-slate-200 pt-4 mt-4">
                    <span className="text-[#B89000] font-bold text-lg uppercase tracking-wider">Total Amount</span>
                    <span className="text-[#f20c92] text-2xl font-black">{currency}{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              {/* Bank Transfer Details Section */}
              <div className="bg-[#f20c92]/5 border border-[#f20c92]/20 rounded-xl p-8 mb-10">
                <div className="flex items-center gap-3 mb-6">
                  <Building2 className="text-[#B89000] w-6 h-6" />
                  <h3 className="text-[#B89000] font-bold text-lg uppercase tracking-widest">Bank Transfer Details</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Account Name</p>
                    <p className="text-slate-900 font-medium tracking-wide">Cynth Fabrics Limited</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Bank Name</p>
                    <p className="text-slate-900 font-medium tracking-wide">Zenith Bank PLC</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Account Number</p>
                    <p className="text-[#f20c92] font-bold text-xl tracking-widest">1012345678</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Note */}
              <div className="flex items-start gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
                <MessageCircle className="text-[#f20c92] w-5 h-5 mt-0.5 shrink-0" />
                <p className="text-slate-700 text-sm leading-relaxed">
                  <span className="font-bold text-slate-900">Note:</span> Please share a screenshot of your payment on WhatsApp to finalize your order. Our team will verify and dispatch within 24 hours of confirmation.
                </p>
              </div>

              {/* Footer */}
              <footer className="mt-20 border-t border-slate-200 pt-10 text-center">
                <div className="flex flex-wrap justify-center gap-8 mb-6">
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>+234 800 123 4567</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Mail className="w-4 h-4" />
                    <span>sales@cynthfabrics.com</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-sm">
                    <Globe className="w-4 h-4" />
                    <span>www.cynthfabrics.com</span>
                  </div>
                </div>
                <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em]">Exquisite Luxury Fabrics for the Modern Wardrobe</p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
