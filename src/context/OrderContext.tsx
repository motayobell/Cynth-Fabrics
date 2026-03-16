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

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      // Parse dates back to Date objects
      return JSON.parse(savedOrders, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      });
    }
    return INITIAL_ORDERS;
  });

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (newOrderData: Omit<Order, 'id' | 'status' | 'date' | 'customer'> & { customerName: string }) => {
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

    setOrders(prevOrders => [newOrder, ...prevOrders]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id ? { ...order, status } : order
      )
    );
  };

  const updateOrderShipping = (id: string, fee: string, currency: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === id ? { ...order, shippingFee: fee, shippingCurrency: currency } : order
      )
    );
  };

  const deleteOrder = (id: string) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus, updateOrderShipping, deleteOrder }}>
      {children}
    </OrderContext.Provider>
  );
};
