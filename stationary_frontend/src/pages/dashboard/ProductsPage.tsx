import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Plus, Loader2, Package, AlertCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
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

    const { data: myShopsData } = useQuery<{ myShops: { response: { status: boolean }; data: Array<{ id: string }> } }>(
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
            if (res?.status) {
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
                        'fixed bottom-4 right-4 z-[100] max-w-sm rounded-lg border px-4 py-3 shadow-lg',
                        toast.type === 'success'
                            ? 'border-green-200 bg-green-50 text-green-800'
                            : 'border-red-200 bg-red-50 text-red-800'
                    )}
                    role="alert"
                >
                    {toast.message}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Products & Services</h1>
                    <p className="text-slate-500 mt-1">Manage your printing services and pricing</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open: boolean) => { setDialogOpen(open); if (!open) closeDialogAndReset(); }}>
                    <DialogTrigger asChild>
                        <Button className="bg-brand-600 text-white hover:bg-brand-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add Service</DialogTitle>
                            <DialogDescription>Add a new service and set its base price.</DialogDescription>
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
                                label="Price"
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
                            />
                            <DialogFooter>
                                <Button type="submit" disabled={updating}>
                                    {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Save Service
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Content */}
            {!shopId ? (
                <Card className="border border-slate-200">
                    <CardContent className="py-12 text-center text-slate-500">
                        <Package className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                        <p className="font-medium">No shop found</p>
                        <p className="text-sm">Create or select a shop to manage products and services.</p>
                    </CardContent>
                </Card>
            ) : pricingLoading ? (
                <Card className="border border-slate-200">
                    <CardContent className="py-12 flex items-center justify-center gap-2 text-slate-500">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Loading services…</span>
                    </CardContent>
                </Card>
            ) : pricingError || response?.status === false ? (
                <Card className="border border-red-200 bg-red-50/50">
                    <CardContent className="py-12 flex flex-col items-center justify-center gap-2 text-red-700">
                        <AlertCircle className="h-10 w-10" />
                        <p className="font-medium">Failed to load services</p>
                        <p className="text-sm">
                            {pricingError?.message ?? response?.message ?? 'Please try again later.'}
                        </p>
                    </CardContent>
                </Card>
            ) : pricingRules.length === 0 ? (
                <Card className="border border-slate-200">
                    <CardContent className="py-12 text-center text-slate-500">
                        <Package className="h-12 w-12 mx-auto mb-3 text-slate-400" />
                        <p className="font-medium">No services yet</p>
                        <p className="text-sm">Add your first service using the button above.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pricingRules.map((rule: ShopPricingRule) => (
                        <Card key={rule.id} className="border border-slate-200 shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">
                                    {getServiceTypeLabel(rule.serviceType)}
                                </CardTitle>
                                <CardDescription>
                                    Category: {getServiceTypeLabel(rule.serviceType)}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-semibold text-slate-900">
                                    {Number(rule.basePrice).toFixed(2)} <span className="text-sm font-normal text-slate-500">base price</span>
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
