import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Order {
  id: string;
  customer: {
    name: string;
    initials: string;
    time: string;
  };
  contact: {
    email: string;
    phone: string;
  };
  location: {
    country: string;
    code: string;
  };
  product: {
    name: string;
    image: string;
    price: string;
    quantity: number;
    description?: string;
  };
  size: string;
  color?: string;
  customizations: string;
  status: 'New Enquiry' | 'Contacted' | 'Payment Confirmed' | 'Delivered';
  shippingFee?: string;
  shippingCurrency?: string;
  date: Date;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'status' | 'date' | 'customer'> & { customerName: string }) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  updateOrderShipping: (id: string, fee: string, currency: string) => void;
  deleteOrder: (id: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

// Initial mock data
const INITIAL_ORDERS: Order[] = [
  {
    id: '1',
    customer: { name: 'Oluwatobi Adeyemi', initials: 'OA', time: '2 hours ago' },
    contact: { email: 't.adeyemi@fashion.com', phone: '+44 772 123 4567' },
    location: { country: 'United Kingdom', code: 'UK' },
    product: { 
      name: 'Aso Oke Ceremonial Kaftan', 
      image: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?q=80&w=2787&auto=format&fit=crop',
      price: '£1,200',
      quantity: 1,
      description: 'Hand-woven Aso Oke with intricate embroidery.'
    },
    size: 'XL (CUSTOM)',
    color: 'Blue',
    customizations: 'Please make the sleeves slightly longer.',
    status: 'New Enquiry',
    shippingFee: '',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: '2',
    customer: { name: 'Chidi Okafor', initials: 'CO', time: '5 hours ago' },
    contact: { email: 'chidi.o@gmail.com', phone: '+1 416 555 0199' },
    location: { country: 'Canada', code: 'CA' },
    product: { 
      name: 'Hand-beaded Ankara Gown', 
      image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?q=80&w=2834&auto=format&fit=crop',
      price: '$850',
      quantity: 1,
      description: 'Stunning Ankara gown with hand-beaded details.'
    },
    size: 'SIZE 12',
    color: 'Red',
    customizations: '',
    status: 'New Enquiry',
    shippingFee: '',
    date: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
  },
  {
    id: '3',
    customer: { name: 'Amara Akpan', initials: 'AA', time: 'Yesterday' },
    contact: { email: 'akpan.amara@icloud.com', phone: '+234 803 123 4567' },
    location: { country: 'Nigeria', code: 'NG' },
    product: { 
      name: 'Gold Silk Filé Gele', 
      image: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?q=80&w=2555&auto=format&fit=crop',
      price: '₦45,000',
      quantity: 1,
      description: 'Premium gold silk gele.'
    },
    size: 'ONE SIZE',
    color: 'Gold',
    customizations: '',
    status: 'Contacted',
    shippingFee: '5000',
    shippingCurrency: '₦',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  },
  {
    id: '4',
    customer: { name: 'Fatima Edozie', initials: 'FE', time: '1 day ago' },
    contact: { email: 'f.edozie@yahoo.com', phone: '+1 212 987 6543' },
    location: { country: 'USA', code: 'US' },
    product: { 
      name: 'Alençon Lace Reception Dress', 
      image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?q=80&w=2787&auto=format&fit=crop',
      price: '$2,100',
      quantity: 1,
      description: 'Elegant lace reception dress.'
    },
    size: 'SIZE 8',
    color: 'White',
    customizations: '',
    status: 'New Enquiry',
    shippingFee: '',
    date: new Date(Date.now() - 25 * 60 * 60 * 1000) // 1 day ago
  }
];

import { db, auth } from '../firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, query, orderBy, serverTimestamp } from 'firebase/firestore';

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('date', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // Seed initial data if empty and user is likely an admin
        if (auth.currentUser) {
          seedInitialData();
        } else {
          setOrders(INITIAL_ORDERS);
        }
      } else {
        const ordersData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            date: data.date?.toDate ? data.date.toDate() : new Date(data.date)
          };
        }) as Order[];
        setOrders(ordersData);
      }
    }, (error) => {
      // Fallback to local data if offline or permission denied
      if (orders.length === 0) {
        setOrders(INITIAL_ORDERS);
      }
    });

    return () => unsubscribe();
  }, []);

  const seedInitialData = async () => {
    try {
      for (const order of INITIAL_ORDERS) {
        const docRef = doc(collection(db, 'orders'), String(order.id));
        await setDoc(docRef, {
          ...order,
          date: order.date
        });
      }
    } catch (error) {
      // If seeding fails (e.g., due to permissions), fallback to local data
      if (orders.length === 0) {
        setOrders(INITIAL_ORDERS);
      }
    }
  };

  const addOrder = async (newOrderData: Omit<Order, 'id' | 'status' | 'date' | 'customer'> & { customerName: string }) => {
    const initials = newOrderData.customerName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);

    const newOrder: Order = {
      id: Date.now().toString(),
      customer: {
        name: newOrderData.customerName,
        initials,
        time: 'Just now'
      },
      contact: newOrderData.contact,
      location: newOrderData.location,
      product: newOrderData.product,
      size: newOrderData.size,
      color: newOrderData.color,
      customizations: newOrderData.customizations,
      status: 'New Enquiry',
      shippingFee: newOrderData.shippingFee || '',
      shippingCurrency: newOrderData.shippingCurrency || '',
      date: new Date()
    };

    try {
      const docRef = doc(collection(db, 'orders'), String(newOrder.id));
      await setDoc(docRef, newOrder);
    } catch (error) {
      console.error("Error adding order:", error);
      throw error;
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const docRef = doc(db, 'orders', String(id));
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  };

  const updateOrderShipping = async (id: string, fee: string, currency: string) => {
    try {
      const docRef = doc(db, 'orders', String(id));
      await updateDoc(docRef, { shippingFee: fee, shippingCurrency: currency });
    } catch (error) {
      console.error("Error updating order shipping:", error);
      throw error;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const docRef = doc(db, 'orders', String(id));
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting order:", error);
      throw error;
    }
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, updateOrderShipping, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
