import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import { Card, CardContent, CardHeader } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/skeleton';
import { Separator } from '../../../components/ui/separator';
import { Avatar } from '../../../components/ui/avatar';
import { 
  Package, 
  Calendar, 
  DollarSign, 
  Copy, 
  Eye, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

// GraphQL query for customer orders
const GET_CUSTOMER_ORDERS = gql`
  query GetCustomerOrders {
    my_orders {
      id
      orderNumber
      status
      createdAt
      totalAmount
      items {
        id
        document {
          fileName
          fileType
        }
        quantity
        price
        configSnapshot
      }
      shop {
        name
        logo
      }
    }
  }
`;

type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED';

interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  totalAmount: number;
  items: Array<{
    id: string;
    document: {
      fileName: string;
      fileType: string;
    };
    quantity: number;
    price: number;
    configSnapshot: any;
  }>;
  shop: {
    name: string;
    logo?: string;
  };
}

interface GetCustomerOrdersResponse {
  my_orders: Order[];
}

const statusConfig = {
  PENDING: {
    label: 'Pending',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    icon: Clock,
  },
  PROCESSING: {
    label: 'Processing',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: AlertCircle,
  },
  SHIPPED: {
    label: 'Shipped',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    icon: Truck,
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: CheckCircle,
  },
};

const OrderProgressTracker = ({ status }: { status: OrderStatus }) => {
  const stages = [
    { key: 'PENDING', label: 'Order Placed', icon: Package },
    { key: 'PROCESSING', label: 'Processing', icon: AlertCircle },
    { key: 'SHIPPED', label: 'Shipped', icon: Truck },
    { key: 'DELIVERED', label: 'Delivered', icon: CheckCircle },
  ];

  const currentStageIndex = stages.findIndex(stage => stage.key === status);

  return (
    <div className="flex items-center justify-between mb-6">
      {stages.map((stage, index) => {
        const Icon = stage.icon;
        const isActive = index <= currentStageIndex;

        return (
          <div key={stage.key} className="flex flex-col items-center flex-1">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                ${isActive 
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' 
                  : 'bg-slate-700 text-slate-400'
                }
              `}
            >
              <Icon className="h-5 w-5" />
            </div>
            <span className={`text-xs mt-2 text-center ${
              isActive ? 'text-cyan-400' : 'text-slate-500'
            }`}>
              {stage.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const OrderCard = ({ order }: { order: Order }) => {
  const [copied, setCopied] = useState(false);
  const statusInfo = statusConfig[order.status];

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 bg-slate-700">
              {order.shop.logo ? (
                <img src={order.shop.logo} alt={order.shop.name} className="h-full w-full object-cover rounded-full" />
              ) : (
                <Package className="h-6 w-6 text-cyan-400" />
              )}
            </Avatar>
            <div>
              <h3 className="text-white font-semibold">{order.shop.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-slate-400 text-sm font-mono">
                  #{order.orderNumber.slice(-8)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyOrderId}
                  className="h-6 w-6 p-0 text-slate-400 hover:text-cyan-400"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                {copied && (
                  <span className="text-cyan-400 text-xs">Copied!</span>
                )}
              </div>
            </div>
          </div>
          <Badge className={statusInfo.color}>
            <div className="flex items-center gap-1">
              <statusInfo.icon className="h-3 w-3" />
              {statusInfo.label}
            </div>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Order Progress */}
          <OrderProgressTracker status={order.status} />
          
          <Separator className="bg-slate-700" />
          
          {/* Order Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Calendar className="h-4 w-4" />
                <span>Order Date</span>
              </div>
              <p className="text-white font-medium">{formatDate(order.createdAt)}</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <DollarSign className="h-4 w-4" />
                <span>Total Amount</span>
              </div>
              <p className="text-white font-medium text-lg">
                ${order.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
          
          {/* Items Preview */}
          <div className="space-y-2">
            <h4 className="text-slate-300 text-sm font-medium">Items</h4>
            <div className="space-y-2">
              {order.items.slice(0, 2).map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-slate-700 rounded flex items-center justify-center">
                      {item.document.fileType.includes('pdf') ? (
                        <div className="h-4 w-4 bg-red-500 rounded" />
                      ) : (
                        <Package className="h-4 w-4 text-slate-400" />
                      )}
                    </div>
                    <span className="text-slate-300 truncate max-w-[150px]">
                      {item.document.fileName}
                    </span>
                  </div>
                  <span className="text-slate-400">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </span>
                </div>
              ))}
              {order.items.length > 2 && (
                <p className="text-slate-500 text-xs">
                  +{order.items.length - 2} more items
                </p>
              )}
            </div>
          </div>
          
          {/* Action Button */}
          <Button 
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white"
            onClick={() => {
              // TODO: Navigate to order details
              console.log('View order details:', order.id);
            }}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-6">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((j) => (
                <Skeleton key={j} className="h-10 w-10 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-4 w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="h-24 w-24 bg-slate-800 rounded-full flex items-center justify-center mb-4">
      <Package className="h-12 w-12 text-slate-600" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">No orders yet</h3>
    <p className="text-slate-400 text-center max-w-md">
      You haven't placed any orders yet. Upload some documents and place your first order to get started!
    </p>
    <Button 
      className="mt-6 bg-cyan-500 hover:bg-cyan-600 text-white"
      onClick={() => {
        // TODO: Navigate to upload page
        window.location.href = '';
      }}
    >
      <Package className="h-4 w-4 mr-2" />
      Place Your First Order
    </Button>
  </div>
);

const ErrorState = ({ error, onRetry }: { error: any; onRetry: () => void }) => (
  <Card className="bg-red-900/20 border-red-800/50">
    <CardContent className="flex flex-col items-center justify-center py-12">
      <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
      <h3 className="text-lg font-semibold text-white mb-2">Failed to load orders</h3>
      <p className="text-slate-400 text-center mb-4">
        {error?.message || 'Something went wrong while fetching your orders.'}
      </p>
      <Button 
        variant="outline" 
        onClick={onRetry}
        className="border-red-500 text-red-400 hover:bg-red-500/10"
      >
        Try Again
      </Button>
    </CardContent>
  </Card>
);

export default function CustomerOrdersPage() {
  const { loading, error, data } = useQuery<GetCustomerOrdersResponse>(GET_CUSTOMER_ORDERS, {
    variables: {},
    context: {
      headers: {
        Authorization: `JWT ${localStorage.getItem('token') || ''}`,
      },
    },
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
  });

  const handleRetry = () => {
    // Force refetch by using a unique timestamp
    window.location.reload();
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              My <span className="text-cyan-400">Orders</span>
            </h1>
            <p className="text-slate-400">Track the progress of your orders</p>
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              My <span className="text-cyan-400">Orders</span>
            </h1>
            <p className="text-slate-400">Track the progress of your orders</p>
          </div>
          <ErrorState error={error} onRetry={handleRetry} />
        </div>
      </div>
    );
  }

  const orders = data?.my_orders || [];

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            My <span className="text-cyan-400">Orders</span>
          </h1>
          <p className="text-slate-400">Track the progress of your orders</p>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {orders.map((order: Order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
