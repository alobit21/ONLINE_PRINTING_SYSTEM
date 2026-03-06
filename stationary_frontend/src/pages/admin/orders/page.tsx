'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Package, Clock, CheckCircle, XCircle, MoreHorizontal, Eye, Download, Truck } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/Button';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Input } from '../../../components/ui/Input';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    email: string;
    firstName: string;
    lastName: string;
  };
  shop: {
    name: string;
    owner: string;
  };
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
}

interface OrderItem {
  id: string;
  documentName: string;
  copies: number;
  pages: number;
  binding: string;
  lamination: string;
  price: number;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const mockOrders: Order[] = [
          {
            id: '1',
            orderNumber: 'ORD-2024-001',
            customer: {
              email: 'customer@example.com',
              firstName: 'John',
              lastName: 'Doe',
            },
            shop: {
              name: 'Print Shop Dar',
              owner: 'owner@example.com',
            },
            status: 'PROCESSING',
            totalAmount: 15000,
            createdAt: '2024-03-06T10:30:00Z',
            items: [
              {
                id: '1',
                documentName: 'Thesis Document.pdf',
                copies: 3,
                pages: 45,
                binding: 'SPIRAL',
                lamination: 'GLOSSY',
                price: 5000,
              },
              {
                id: '2',
                documentName: 'Presentation Slides.pdf',
                copies: 10,
                pages: 20,
                binding: 'NONE',
                lamination: 'MATTE',
                price: 10000,
              },
            ],
          },
          {
            id: '2',
            orderNumber: 'ORD-2024-002',
            customer: {
              email: 'user@example.com',
              firstName: 'Jane',
              lastName: 'Smith',
            },
            shop: {
              name: 'Quick Print Center',
              owner: 'quick@example.com',
            },
            status: 'COMPLETED',
            totalAmount: 8000,
            createdAt: '2024-03-05T14:20:00Z',
            items: [
              {
                id: '3',
                documentName: 'Business Cards.pdf',
                copies: 100,
                pages: 1,
                binding: 'NONE',
                lamination: 'GLOSSY',
                price: 8000,
              },
            ],
          },
          {
            id: '3',
            orderNumber: 'ORD-2024-003',
            customer: {
              email: 'client@example.com',
              firstName: 'Mike',
              lastName: 'Johnson',
            },
            shop: {
              name: 'Print Shop Dar',
              owner: 'owner@example.com',
            },
            status: 'PENDING',
            totalAmount: 25000,
            createdAt: '2024-03-06T09:15:00Z',
            items: [
              {
                id: '4',
                documentName: 'Annual Report.pdf',
                copies: 5,
                pages: 80,
                binding: 'HARDCOVER',
                lamination: 'GLOSSY',
                price: 25000,
              },
            ],
          },
        ];
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        setOrders(mockOrders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.shop.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      PROCESSING: 'bg-blue-100 text-blue-800 border-blue-200',
      COMPLETED: 'bg-green-100 text-green-800 border-green-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    };
    
    const icons = {
      PENDING: <Clock className="h-3 w-3 mr-1" />,
      PROCESSING: <Package className="h-3 w-3 mr-1" />,
      COMPLETED: <CheckCircle className="h-3 w-3 mr-1" />,
      CANCELLED: <XCircle className="h-3 w-3 mr-1" />,
    };
    
    return (
      <Badge className={styles[status as keyof typeof styles]}>
        {icons[status as keyof typeof icons]}
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-700 rounded w-1/3"></div>
              <div className="h-6 bg-gray-700 rounded w-1/2"></div>
              <div className="h-4 bg-gray-700 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <ShoppingCart className="h-8 w-8 text-blue-400" />
            Order Management
          </h1>
          <p className="text-gray-400">Manage all platform orders and fulfillment</p>
        </div>
        <div className="text-sm text-gray-400">
          Total: {orders.length} orders
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
        <select 
          value={statusFilter} 
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white rounded px-3 py-2"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">Order Number</TableHead>
              <TableHead className="text-gray-300">Customer</TableHead>
              <TableHead className="text-gray-300">Shop</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Total Amount</TableHead>
              <TableHead className="text-gray-300">Date</TableHead>
              <TableHead className="text-gray-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} className="border-gray-700 hover:bg-gray-750">
                <TableCell className="text-gray-100 font-medium">
                  {order.orderNumber}
                </TableCell>
                <TableCell className="text-gray-300">
                  <div>
                    <p className="font-medium">
                      {order.customer.firstName} {order.customer.lastName}
                    </p>
                    <p className="text-sm text-gray-400">{order.customer.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  <div>
                    <p className="font-medium">{order.shop.name}</p>
                    <p className="text-sm text-gray-400">{order.shop.owner}</p>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-gray-100 font-medium">
                  TZS {order.totalAmount.toLocaleString()}
                </TableCell>
                <TableCell className="text-gray-300">
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                      <DropdownMenuLabel className="text-gray-300">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-gray-300 hover:bg-gray-700">
                        <Download className="h-4 w-4 mr-2" />
                        Download Invoice
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700" />
                      <DropdownMenuItem className="text-blue-400 hover:bg-gray-700 hover:text-blue-400">
                        <Package className="h-4 w-4 mr-2" />
                        Mark as Processing
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-green-400 hover:bg-gray-700 hover:text-green-400">
                        <Truck className="h-4 w-4 mr-2" />
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 hover:bg-gray-700 hover:text-red-400">
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-600" />
          <p className="text-lg font-medium">No orders found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
