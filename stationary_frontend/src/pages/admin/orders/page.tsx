'use client';

import { useQuery } from '@apollo/client/react';
import { ShoppingCart, Package, Clock, CheckCircle, XCircle, MoreHorizontal, Eye, Download, Truck } from 'lucide-react';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/LegacyButton';
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
import { GET_ALL_ORDERS } from '../../../features/admin/api';

export default function AdminOrdersPage() {
  const { data, loading, error } = useQuery(GET_ALL_ORDERS);

  const orders = data?.orders?.data || [];

  const getStatusBadge = (status: string) => {
    const styles = {
      UPLOADED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      ACCEPTED: 'bg-blue-100 text-blue-800 border-blue-200',
      PRINTING: 'bg-purple-100 text-purple-800 border-purple-200',
      READY: 'bg-green-100 text-green-800 border-green-200',
      COMPLETED: 'bg-green-100 text-green-800 border-green-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
    };
    
    const icons = {
      UPLOADED: <Clock className="h-3 w-3 mr-1" />,
      ACCEPTED: <Package className="h-3 w-3 mr-1" />,
      PRINTING: <Package className="h-3 w-3 mr-1" />,
      READY: <CheckCircle className="h-3 w-3 mr-1" />,
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

      {/* Orders Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead className="text-gray-300">Order ID</TableHead>
              <TableHead className="text-gray-300">Customer</TableHead>
              <TableHead className="text-gray-300">Shop</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Total Price</TableHead>
              <TableHead className="text-gray-300">Date</TableHead>
              <TableHead className="text-gray-300 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order: any) => (
              <TableRow key={order.id} className="border-gray-700 hover:bg-gray-750">
                <TableCell className="text-gray-100 font-medium">
                  {order.id?.substring(0, 8)}...
                </TableCell>
                <TableCell className="text-gray-300">
                  <div>
                    <p className="font-medium">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </p>
                    <p className="text-sm text-gray-400">{order.customer?.email}</p>
                  </div>
                </TableCell>
                <TableCell className="text-gray-300">
                  <div>
                    <p className="font-medium">{order.shop?.name}</p>
                    <p className="text-sm text-gray-400">{order.shop?.owner?.firstName} {order.shop?.owner?.lastName}</p>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(order.status)}</TableCell>
                <TableCell className="text-gray-100 font-medium">
                  TZS {order.totalPrice?.toLocaleString()}
                </TableCell>
                <TableCell className="text-gray-300">
                  {order.createdAt && formatDate(order.createdAt)}
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
                        Accept Order
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

      {orders.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-600" />
          <p className="text-lg font-medium">No orders found</p>
          <p className="text-sm">Orders will appear here when customers place them</p>
        </div>
      )}
    </div>
  );
}
