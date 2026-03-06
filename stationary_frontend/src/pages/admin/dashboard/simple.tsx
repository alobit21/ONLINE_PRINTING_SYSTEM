export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#111827', color: '#f3f4f6' }}>
      {/* Sidebar */}
      <div style={{ width: '256px', background: '#1e293b', borderRight: '1px solid #334155', padding: '24px' }}>
        <h2 style={{ color: 'white', marginBottom: '24px' }}>Admin Menu</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a href="/admin/dashboard" style={{ padding: '12px', background: '#2563eb', color: 'white', borderRadius: '8px', textDecoration: 'none' }}>Dashboard</a>
          <a href="/admin/users" style={{ padding: '12px', color: '#d1d5db', borderRadius: '8px', textDecoration: 'none' }}>Users</a>
          <a href="/admin/shops" style={{ padding: '12px', color: '#d1d5db', borderRadius: '8px', textDecoration: 'none' }}>Shops</a>
          <a href="/admin/orders" style={{ padding: '12px', color: '#d1d5db', borderRadius: '8px', textDecoration: 'none' }}>Orders</a>
          <a href="/admin/documents" style={{ padding: '12px', color: '#d1d5db', borderRadius: '8px', textDecoration: 'none' }}>Documents</a>
          <a href="/admin/pricing" style={{ padding: '12px', color: '#d1d5db', borderRadius: '8px', textDecoration: 'none' }}>Pricing</a>
          <a href="/admin/settings" style={{ padding: '12px', color: '#d1d5db', borderRadius: '8px', textDecoration: 'none' }}>Settings</a>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '24px' }}>
        <h1 style={{ color: 'white', fontSize: '32px', marginBottom: '16px' }}>Admin Dashboard</h1>
        <p style={{ color: '#9ca3af', marginBottom: '32px' }}>If you see 7 menu items on the left, sidebar is working!</p>
        
        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '8px', border: '1px solid #334155' }}>
          <h3 style={{ color: 'white', marginBottom: '16px' }}>✅ Check Sidebar:</h3>
          <ul style={{ color: '#10b981', lineHeight: '1.8' }}>
            <li>Dashboard</li>
            <li>Users</li>
            <li>Shops</li>
            <li>Orders</li>
            <li>Documents</li>
            <li>Pricing</li>
            <li>Settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
