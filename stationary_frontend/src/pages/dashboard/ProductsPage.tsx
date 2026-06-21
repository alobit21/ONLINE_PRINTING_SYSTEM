import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Plus, Loader2, Package, AlertCircle, ShoppingBag, Settings, Tag, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import { Button } from '../../components/ui/LegacyButton';
import { Input } from '../../components/ui/LegacyInput';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/LegacyCard';
import { Select } from '../../components/ui/LegacySelect';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '../../components/ui/dialog';
import {
    GET_MY_SHOPS,
    GET_SHOP_DETAILS_WITH_PRICING,
    UPDATE_PRICING,
} from '../../features/shops/api';
import type {
    GetShopDetailsWithPricingData,
    UpdatePricingData,
    ShopPricingRule,
} from '../../features/shops/types';
import { cn } from '../../lib/utils';

// Backend ServiceType enum labels (matches stationary_backend/stationary_shops/models.py)
const SERVICE_TYPE_OPTIONS: { value: string; label: string }[] = [
    { value: 'PRINTING_BW', label: 'Black & White Printing' },
    { value: 'PRINTING_COLOR', label: 'Color Printing' },
    { value: 'BINDING', label: 'Binding' },
    { value: 'LAMINATION', label: 'Lamination' },
    { value: 'SCANNING', label: 'Scanning' },
];

function getServiceTypeLabel(serviceType: string): string {
    return SERVICE_TYPE_OPTIONS.find((o) => o.value === serviceType)?.label ?? serviceType;
}

interface ToastState {
    type: 'success' | 'error';
    message: string;
}

export function ProductsPage() {
    const [toast, setToast] = useState<ToastState | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [formServiceType, setFormServiceType] = useState('');
    const [formPrice, setFormPrice] = useState('');
    const [formErrors, setFormErrors] = useState<{ serviceType?: string; price?: string }>({});

    const { data: myShopsData } = useQuery<{ myShops: { response: { success: boolean }; data: Array<{ id: string }> } }>(
        GET_MY_SHOPS,
        { fetchPolicy: 'network-only' }
    );
    const shopId = myShopsData?.myShops?.data?.[0]?.id;

    const {
        data: shopData,
        loading: pricingLoading,
        error: pricingError,
        refetch: refetchPricing,
    } = useQuery<GetShopDetailsWithPricingData>(GET_SHOP_DETAILS_WITH_PRICING, {
        variables: { id: shopId },
        skip: !shopId,
        fetchPolicy: 'network-only',
    });

    const [updatePricing, { loading: updating }] = useMutation<UpdatePricingData>(UPDATE_PRICING, {
        onCompleted: (data) => {
            const res = data?.updatePricing?.response;
            if (res?.success) {
                setToast({ type: 'success', message: 'Service added/updated successfully.' });
                setDialogOpen(false);
                refetchPricing();
                setFormServiceType('');
                setFormPrice('');
                setFormErrors({});
            } else {
                setToast({ type: 'error', message: res?.message ?? 'Something went wrong.' });
            }
        },
        onError: (err) => {
            setToast({ type: 'error', message: err.message ?? 'Failed to save service.' });
        },
    });

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [toast]);

    const shop = shopData?.shopDetails?.data;
    const pricingRules = shop?.pricingRules ?? [];
    const response = shopData?.shopDetails?.response;

    // Pagination
    const [page, setPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const totalServices = pricingRules.length;
    const totalPages = Math.ceil(totalServices / ITEMS_PER_PAGE);
    const paginatedRules = pricingRules.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs: { serviceType?: string; price?: string } = {};
        if (!formServiceType.trim()) errs.serviceType = 'Category is required';
        const priceNum = parseFloat(formPrice);
        if (formPrice === '' || isNaN(priceNum) || priceNum < 0) errs.price = 'Valid price is required';
        setFormErrors(errs);
        if (Object.keys(errs).length > 0) return;
        if (!shopId) {
            setToast({ type: 'error', message: 'No shop selected.' });
            return;
        }
        updatePricing({
            variables: {
                shopId,
                serviceType: formServiceType,
                basePrice: priceNum,
                modifiers: null,
            },
        });
    };

    const closeDialogAndReset = () => {
        setFormServiceType('');
        setFormPrice('');
        setFormErrors({});
    };

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div
                    className={cn(
                        'fixed bottom-4 right-4 z-[100] max-w-sm rounded-lg border px-4 py-3 shadow-lg flex items-center gap-2',
                        toast.type === 'success'
                            ? 'border-green-700 bg-green-900/50 text-green-400'
                            : 'border-red-700 bg-red-900/50 text-red-400'
                    )}
                    role="alert"
                >
                    {toast.message}
                </div>
            )}

            {/* 3-Section Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                {/* Center Column: Products List */}
                <div className="xl:col-span-3 space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-ink">Products & Services</h1>
                            <p className="text-steel mt-1">Manage your printing services and pricing</p>
                        </div>
                        <Dialog open={dialogOpen} onOpenChange={(open: boolean) => { setDialogOpen(open); if (!open) closeDialogAndReset(); }}>
                            <DialogTrigger asChild>
                                <Button className="bg-hp-primary text-white hover:bg-hp-primary/90">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Service
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-paper border-fog">
                                <DialogHeader>
                                    <DialogTitle className="text-ink">Add Service</DialogTitle>
                                    <DialogDescription className="text-steel">Add a new service and set its base price.</DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Select
                                        label="Category (Service Type)"
                                        options={SERVICE_TYPE_OPTIONS}
                                        value={formServiceType}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                            setFormServiceType(e.target.value);
                                            setFormErrors((prev) => ({ ...prev, serviceType: undefined }));
                                        }}
                                        error={formErrors.serviceType}
                                        required
                                    />
                                    <Input
                                        label="Price (TZS)"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                        value={formPrice}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            setFormPrice(e.target.value);
                                            setFormErrors((prev) => ({ ...prev, price: undefined }));
                                        }}
                                        error={formErrors.price}
                                        required
                                        className="bg-cloud border-fog text-ink placeholder-steel"
                                    />
                                    <DialogFooter>
                                        <Button type="submit" disabled={updating} className="bg-hp-primary text-white hover:bg-hp-primary/90">
                                            {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                            Save Service
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-steel">Total Services</p>
                                <h3 className="text-2xl font-bold text-ink mt-1">{totalServices}</h3>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-hp-primary/10 flex items-center justify-center">
                                <ShoppingBag className="h-5 w-5 text-hp-primary" />
                            </div>
                        </div>
                        <div className="bg-cloud border border-fog rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-steel">Active Services</p>
                                <h3 className="text-2xl font-bold text-success mt-1">{totalServices}</h3>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                                <Tag className="h-5 w-5 text-success" />
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    {!shopId ? (
                        <Card className="border border-fog bg-cloud shadow-sm">
                            <CardContent className="py-12 text-center text-steel">
                                <Package className="h-12 w-12 mx-auto mb-3 text-steel/50" />
                                <p className="text-lg font-medium text-ink">No shop found</p>
                                <p className="text-sm">Create or select a shop to manage products and services.</p>
                            </CardContent>
                        </Card>
                    ) : pricingLoading ? (
                        <Card className="border border-fog bg-cloud shadow-sm">
                            <CardContent className="py-12 flex items-center justify-center gap-2 text-steel">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                <span>Loading services…</span>
                            </CardContent>
                        </Card>
                    ) : pricingError || response?.success === false ? (
                        <Card className="border border-error bg-error/10">
                            <CardContent className="py-12 flex flex-col items-center justify-center gap-2 text-error">
                                <AlertCircle className="h-10 w-10" />
                                <p className="font-medium">Failed to load services</p>
                                <p className="text-sm">
                                    {pricingError?.message ?? response?.message ?? 'Please try again later.'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : pricingRules.length === 0 ? (
                        <Card className="border border-fog bg-cloud shadow-sm">
                            <CardContent className="py-12 text-center text-steel">
                                <Package className="h-12 w-12 mx-auto mb-3 text-steel/50" />
                                <p className="text-lg font-medium text-ink">No services yet</p>
                                <p className="text-sm">Add your first service using the button above.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {paginatedRules.map((rule: ShopPricingRule) => (
                                    <Card key={rule.id} className="border border-fog bg-cloud shadow-sm hover:border-hp-primary/50 transition-colors">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-base text-ink">
                                                {getServiceTypeLabel(rule.serviceType)}
                                            </CardTitle>
                                            <CardDescription className="text-steel">
                                                Per page base pricing
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-2xl font-semibold text-ink">
                                                <span className="text-sm text-steel mr-1">TZS</span>
                                                {Number(rule.basePrice).toLocaleString()}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            
                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-between mt-6">
                                    <p className="text-sm text-steel">
                                        Showing <span className="font-medium text-ink">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium text-ink">{Math.min(page * ITEMS_PER_PAGE, totalServices)}</span> of <span className="font-medium text-ink">{totalServices}</span> services
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(Math.max(1, page - 1))}
                                            disabled={page === 1}
                                            className="h-8 border-fog text-ink"
                                        >
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Previous
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                                            disabled={page === totalPages}
                                            className="h-8 border-fog text-ink"
                                        >
                                            Next
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column: Quick Actions */}
                <div className="xl:col-span-1 space-y-6">
                    <Card className="bg-cloud border-fog shadow-sm">
                        <CardHeader className="pb-3 border-b border-fog bg-paper rounded-t-xl">
                            <CardTitle className="text-lg font-bold text-ink flex items-center gap-2">
                                <Settings className="h-5 w-5 text-hp-primary" />
                                Pricing Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                            <Button variant="outline" className="w-full justify-start border-fog text-ink hover:bg-paper" onClick={() => setDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add New Service
                            </Button>
                            <Button variant="outline" className="w-full justify-start border-fog text-ink hover:bg-paper">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Bulk Update Prices
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
