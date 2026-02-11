# Customer Order Tracking System

## Overview

A **high-performance, real-time, production-grade order tracking system** designed to maximize transparency, trust, and usability for customers tracking their print orders.

## ✨ Features

### Core Functionality
- ✅ **Real-time Order Tracking** - Live status updates with 10-second polling
- ✅ **Order History** - Complete order history with filtering and search
- ✅ **Visual Timeline** - Animated progress tracking with timestamps
- ✅ **Invoice Downloads** - Generate and download HTML invoices
- ✅ **Quick Reorder** - One-click reordering of past jobs
- ✅ **Notifications** - In-app and browser notifications for status changes
- ✅ **Order Details** - Comprehensive order information drawer
- ✅ **Shop Communication** - Direct contact with print shops

### UX Excellence
- 🎨 **Premium Design** - Modern, vibrant UI with smooth animations
- 📱 **Mobile-First** - Optimized for mobile devices
- ⚡ **Performance** - Lazy loading, virtualization ready
- ♿ **Accessibility** - WCAG compliant with keyboard navigation
- 🌐 **Offline Support** - Graceful degradation when offline

## 📁 Project Structure

```
features/customer/orders/
├── components/
│   ├── OrderCard.tsx              # Order list item with status
│   ├── OrderDetailsDrawer.tsx     # Full order details modal
│   ├── OrderTimelineModal.tsx     # Visual progress timeline
│   ├── OrdersTabs.tsx             # Active/Completed/Cancelled tabs
│   ├── InvoiceDownloader.tsx      # Invoice generation & download
│   ├── ReorderFlow.tsx            # Reorder confirmation & processing
│   ├── NotificationCenter.tsx     # Notification dropdown panel
│   ├── Badge.tsx                  # Status badge component
│   └── Progress.tsx               # Progress bar component
├── hooks/
│   ├── useCustomerOrders.ts       # Fetch and filter orders
│   ├── useOrderLiveTracking.ts    # Real-time status tracking
│   ├── useOrderHistory.ts         # Pagination & search
│   └── useReorder.ts              # Reorder functionality
├── pages/
│   └── CustomerOrdersPage.tsx     # Main orders page
├── api.ts                         # GraphQL queries & mutations
└── types.ts                       # TypeScript type definitions

stores/
└── notificationStore.ts           # Global notification state
```

## 🔧 Components

### 1. OrderCard
Displays order summary in list view with:
- Shop name and logo
- Current status badge
- Progress bar (for active orders)
- ETA countdown
- Price summary
- Quick actions (QR code, contact)

### 2. OrderDetailsDrawer
Bottom sheet drawer showing:
- Visual progress timeline
- Shop and pickup information
- Document list with specifications
- Pricing breakdown
- Action buttons (Timeline, Invoice, Reorder, Support)

### 3. OrderTimelineModal
Full-screen modal with:
- Animated step-by-step progress
- Completion timestamps
- Shop location details
- Estimated ready time

### 4. InvoiceDownloader
Generates professional HTML invoices with:
- Order details and specifications
- Itemized pricing
- Shop and customer information
- Auto-download functionality

### 5. ReorderFlow
Multi-step reorder process:
- Order summary confirmation
- Quick reorder option
- Edit before reorder option
- Success/error handling

### 6. NotificationCenter
Dropdown notification panel with:
- Unread count badge
- Notification list with icons
- Mark as read functionality
- Navigation to related orders

## 🎣 Custom Hooks

### useCustomerOrders
```typescript
const {
    activeOrders,
    completedOrders,
    cancelledOrders,
    loading,
    refetch
} = useCustomerOrders();
```

### useOrderLiveTracking
```typescript
const {
    order,
    isTracking,
    startTracking,
    stopTracking,
    manualRefresh
} = useOrderLiveTracking({
    orderId: 'uuid',
    onStatusChange: (newStatus, order) => {
        // Handle status change
    },
    pollInterval: 10000 // 10 seconds
});
```

### useOrderHistory
```typescript
const {
    orders,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    setFilter,
    setSearchQuery,
    stats
} = useOrderHistory({
    pageSize: 10,
    initialFilter: 'all'
});
```

### useReorder
```typescript
const {
    quickReorder,
    reorderWithChanges,
    isReordering,
    error
} = useReorder({
    onSuccess: (orderId) => {
        // Handle success
    },
    onError: (error) => {
        // Handle error
    }
});
```

## 🔔 Notifications

### Notification Store
Global state management for notifications using Zustand:

```typescript
const {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
} = useNotificationStore();
```

### Adding Notifications
```typescript
addNotification({
    type: 'order_ready',
    title: 'Order Ready! 🎉',
    message: 'Your order is ready for pickup',
    orderId: order.id,
    orderStatus: 'READY',
    actionUrl: '/dashboard/customer/orders'
});
```

### Browser Notifications
Request permission and show native notifications:
```typescript
import { requestNotificationPermission } from '../../../../stores/notificationStore';

await requestNotificationPermission();
```

## 📊 Order Status Flow

```
UPLOADED → ACCEPTED → PRINTING → READY → COMPLETED
                                    ↓
                                CANCELLED
```

### Status Descriptions
- **UPLOADED**: Documents uploaded, awaiting shop confirmation
- **ACCEPTED**: Shop confirmed and queued the order
- **PRINTING**: Documents are being printed
- **READY**: Order ready for customer pickup
- **COMPLETED**: Order picked up and completed
- **CANCELLED**: Order was cancelled

## 🎨 Design System

### Colors
- **Brand**: `#6366f1` (Indigo)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Amber)
- **Error**: `#ef4444` (Red)
- **Info**: `#3b82f6` (Blue)

### Animations
- **Fade In**: Smooth opacity transitions
- **Scale**: Hover and active states
- **Slide**: Drawer and modal entrances
- **Pulse**: Live tracking indicator
- **Rotate**: Refresh button

### Typography
- **Headings**: Bold, tight tracking
- **Body**: Medium weight, readable
- **Labels**: Uppercase, wide tracking
- **Monospace**: Order IDs, timestamps

## 🚀 Performance Optimizations

### Implemented
- ✅ Apollo Client caching
- ✅ Optimistic UI updates
- ✅ Polling with auto-stop for completed orders
- ✅ Memoized computations
- ✅ Lazy component loading
- ✅ AnimatePresence for smooth transitions

### Ready to Implement
- 📦 Virtual scrolling for large order lists
- 📦 Infinite scroll for order history
- 📦 Service worker for offline support
- 📦 Image lazy loading
- 📦 Code splitting per route

## ♿ Accessibility

- ✅ Semantic HTML structure
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ Screen reader friendly
- ✅ High contrast mode support
- ✅ Large touch targets (min 44x44px)

## 🔐 Error Handling

### Network Errors
- Automatic retry with exponential backoff
- Offline detection and messaging
- Fallback to cached data

### GraphQL Errors
- User-friendly error messages
- Error boundaries for component crashes
- Logging for debugging

### Validation Errors
- Client-side validation
- Server error display
- Form field highlighting

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Optimizations
- Bottom sheet drawers
- Sticky headers
- Touch-friendly buttons
- Swipe gestures (ready to implement)

## 🧪 Testing Recommendations

### Unit Tests
- Component rendering
- Hook logic
- Utility functions
- State management

### Integration Tests
- Order flow end-to-end
- Reorder functionality
- Notification system
- Real-time updates

### E2E Tests
- Complete user journeys
- Cross-browser compatibility
- Mobile device testing
- Performance benchmarks

## 📈 Analytics Events

Recommended tracking events:
- `order_viewed`
- `order_details_opened`
- `timeline_viewed`
- `invoice_downloaded`
- `reorder_initiated`
- `reorder_completed`
- `notification_clicked`
- `shop_contacted`

## 🔄 Real-Time Updates

### Polling Strategy
- **Active Orders**: 10-second intervals
- **Completed Orders**: No polling
- **Manual Refresh**: User-triggered

### WebSocket Support (Future)
Ready to integrate GraphQL subscriptions:
```graphql
subscription OnOrderStatusChange($orderId: UUID!) {
    orderStatusChanged(orderId: $orderId) {
        id
        status
        estimatedCompletionTime
    }
}
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Apollo Client configured
- GraphQL backend running

### Environment Variables
```env
VITE_GRAPHQL_ENDPOINT=http://localhost:8000/graphql
VITE_WS_ENDPOINT=ws://localhost:8000/graphql
```

### Running Locally
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

## 📝 GraphQL Schema Requirements

### Queries
```graphql
query GetMyOrders {
    myOrders {
        id
        status
        totalPrice
        createdAt
        estimatedCompletionTime
        completedAt
        shop { id name address banner }
        items {
            id
            pageCount
            price
            configSnapshot
            document { id name }
        }
    }
}
```

### Mutations
```graphql
mutation CreateOrder($shopId: UUID!, $items: [OrderItemInput!]!) {
    createOrder(shopId: $shopId, items: $items) {
        response { status message }
        order { id status }
    }
}

mutation UpdateOrderStatus($orderId: UUID!, $status: String!) {
    updateOrderStatus(orderId: $orderId, status: $status) {
        response { status message }
        order { id status completedAt }
    }
}
```

## 🎯 Future Enhancements

### Planned Features
- [ ] Order cancellation
- [ ] Order modification
- [ ] Rating and reviews
- [ ] Order sharing
- [ ] Delivery tracking
- [ ] Multiple pickup locations
- [ ] Scheduled printing
- [ ] Bulk reorders

### Technical Improvements
- [ ] GraphQL subscriptions
- [ ] Progressive Web App (PWA)
- [ ] Push notifications
- [ ] Offline mode
- [ ] Advanced filtering
- [ ] Export order history
- [ ] Print receipt

## 📚 Dependencies

### Core
- React 18+
- TypeScript 5+
- Apollo Client 3+
- Zustand 4+

### UI
- Framer Motion
- Lucide React
- TailwindCSS
- date-fns

### Utilities
- clsx / cn utility
- React Router DOM

## 🤝 Contributing

1. Follow the existing code style
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation
5. Ensure accessibility compliance

## 📄 License

MIT License - See LICENSE file for details

---

**Built with ❤️ for maximum customer satisfaction**
