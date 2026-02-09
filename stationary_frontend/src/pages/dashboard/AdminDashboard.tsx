import { Shield, Users, Store, FileText, LogOut, BarChart3, Loader2, AlertCircle } from 'lucide-react';
import { useQuery } from '@apollo/client/react';
import { GET_ADMIN_STATS, GET_PENDING_SHOPS } from '../../features/admin/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';

export const AdminDashboard = () => {
    const { data: statsData, loading: statsLoading, error: statsError } = useQuery(GET_ADMIN_STATS);
    const { data: pendingData, loading: pendingLoading } = useQuery(GET_PENDING_SHOPS);

    console.log("Admin Stats Data:", statsData);
    console.log("Pending Shops Data:", pendingData);

    if (statsLoading || pendingLoading) {
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-brand-600" />
            </div>
        );
    }

    if (statsError) {
        return (
            <div className="p-8 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                    <h2 className="text-xl font-bold text-slate-900">Error Loading Admin Data</h2>
                    <p className="text-slate-500">{statsError.message}</p>
                </div>
            </div>
        );
    }

    const stats = (statsData as any)?.adminStats?.data;
    const pendingShops = (pendingData as any)?.pending_shops?.data || (pendingData as any)?.pendingShops?.data || [];

    const adminStats = [
        { title: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Total Shops', value: stats?.totalShops || 0, icon: Store, iconColor: 'text-green-600', bg: 'bg-green-100' },
        { title: 'Total Orders', value: stats?.totalOrders || 0, icon: FileText, iconColor: 'text-purple-600', bg: 'bg-purple-100' },
        { title: 'Revenue', value: `TZS ${(stats?.totalRevenue || 0).toLocaleString()}`, icon: BarChart3, iconColor: 'text-amber-600', bg: 'bg-amber-100' },
    ];

    return (
        <div className="p-8 space-y-8 fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">System Administration</h1>
                    <p className="text-slate-500 mt-1">Manage platform-wide configurations and users.</p>
                </div>
                <div className="p-3 bg-red-100 rounded-full text-red-600">
                    <Shield className="h-8 w-8" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {adminStats.map((stat, idx) => (
                    <Card key={idx} className="border-none shadow-md">
                        <CardContent className="p-6">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${stat.bg}`}>
                                    <stat.icon className={`h-6 w-6 ${stat.iconColor || stat.color}`} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Platform Health</CardTitle>
                        <CardDescription>Real-time system status and logs</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 flex items-center justify-center text-slate-400 italic">
                        System health monitoring charts coming soon...
                    </CardContent>
                </Card>

                <Card className="border-none shadow-md">
                    <CardHeader>
                        <CardTitle>Pending Verifications</CardTitle>
                        <CardDescription>Shops and documents awaiting approval</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {pendingShops.length === 0 ? (
                                <p className="text-center py-8 text-slate-500">No pending verifications</p>
                            ) : (
                                pendingShops.map((shop: any) => (
                                    <div key={shop.id} className="p-4 bg-slate-50 rounded-lg flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Store className="h-5 w-5 text-slate-400" />
                                            <div>
                                                <p className="font-medium text-slate-900">{shop.name}</p>
                                                <p className="text-xs text-slate-500">{shop.address}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="text-xs px-3 py-1 bg-brand-600 text-white rounded-full font-medium hover:bg-brand-700">Approve</button>
                                            <button className="text-xs px-3 py-1 bg-red-100 text-red-600 rounded-full font-medium hover:bg-red-200">Reject</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
