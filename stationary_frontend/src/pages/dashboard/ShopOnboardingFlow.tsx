import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_SHOP, UPDATE_PRICING } from '../../features/shops/api';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/LegacyCard';
import { Button } from '../../components/ui/LegacyButton';
import { Store, MapPin, DollarSign, CheckCircle, Loader2, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon missing in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

function LocationPicker({ position, setPosition }: { position: [number, number], setPosition: (pos: [number, number]) => void }) {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });
    return (
        <Marker position={position}></Marker>
    );
}

interface Props {
    onComplete: () => void;
}

export const ShopOnboardingFlow = ({ onComplete }: Props) => {
    const { user } = useAuthStore();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        name: `${user?.email?.split('@')[0]}'s Print Shop` || '',
        description: '',
        address: '',
        latitude: '-6.1630',
        longitude: '35.7516',
        bwPrice: '100',
        colorPrice: '500',
    });

    const [createShop] = useMutation(CREATE_SHOP);
    const [updatePricing] = useMutation(UPDATE_PRICING);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // 1. Create Shop
            const { data: shopData } = await createShop({
                variables: {
                    name: formData.name,
                    description: formData.description,
                    address: formData.address,
                    latitude: parseFloat(formData.latitude),
                    longitude: parseFloat(formData.longitude),
                }
            });

            const shopId = shopData?.createShop?.shop?.id;
            if (!shopId) throw new Error("Failed to create shop.");

            // 2. Set Pricing Rules
            const services = [
                { type: 'BW', price: parseFloat(formData.bwPrice) },
                { type: 'COLOR', price: parseFloat(formData.colorPrice) },
            ];

            for (const service of services) {
                await updatePricing({
                    variables: {
                        shopId,
                        serviceType: service.type,
                        basePrice: service.price,
                        modifiers: JSON.stringify({ bulk_discount: 10 })
                    }
                });
            }

            // Finish
            onComplete();
        } catch (error) {
            console.error(error);
            alert("Error setting up shop. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Progress Indicator */}
                <div className="mb-8 flex items-center justify-between relative">
                    <div className="absolute left-0 top-1/2 w-full h-1 bg-fog -z-10 -translate-y-1/2 rounded" />
                    <div className="absolute left-0 top-1/2 h-1 bg-hp-primary -z-10 -translate-y-1/2 rounded transition-all duration-500" style={{ width: `${((step - 1) / 2) * 100}%` }} />
                    
                    {[1, 2, 3].map((num) => (
                        <div key={num} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= num ? 'bg-hp-primary text-white shadow-md' : 'bg-canvas text-steel border-2 border-fog'}`}>
                            {step > num ? <CheckCircle className="w-5 h-5" /> : num}
                        </div>
                    ))}
                </div>

                <Card className="bg-canvas border-fog shadow-xl">
                    <CardHeader className="bg-cloud border-b border-fog pb-6 rounded-t-xl">
                        {step === 1 && (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-hp-primary/10 rounded-lg text-hp-primary">
                                        <Store className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-2xl text-ink">Shop Details</CardTitle>
                                </div>
                                <p className="text-steel">Tell customers about your business.</p>
                            </>
                        )}
                        {step === 2 && (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-hp-primary/10 rounded-lg text-hp-primary">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-2xl text-ink">Location</CardTitle>
                                </div>
                                <p className="text-steel">Where can customers find you?</p>
                            </>
                        )}
                        {step === 3 && (
                            <>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2 bg-hp-primary/10 rounded-lg text-hp-primary">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-2xl text-ink">Initial Pricing</CardTitle>
                                </div>
                                <p className="text-steel">Set your base printing rates.</p>
                            </>
                        )}
                    </CardHeader>

                    <CardContent className="p-6 sm:p-8 space-y-6">
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-ink">Shop Name</label>
                                    <input 
                                        name="name" 
                                        value={formData.name} 
                                        onChange={handleChange} 
                                        className="w-full p-3 rounded-lg border border-fog bg-background text-ink focus:border-hp-primary focus:ring-1 focus:ring-hp-primary outline-none transition-all"
                                        placeholder="e.g. Campus Prints"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-ink">Description</label>
                                    <textarea 
                                        name="description" 
                                        value={formData.description} 
                                        onChange={handleChange} 
                                        rows={3}
                                        className="w-full p-3 rounded-lg border border-fog bg-background text-ink focus:border-hp-primary focus:ring-1 focus:ring-hp-primary outline-none transition-all"
                                        placeholder="Briefly describe your services..."
                                    />
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-ink">Physical Address</label>
                                    <input 
                                        name="address" 
                                        value={formData.address} 
                                        onChange={handleChange} 
                                        className="w-full p-3 rounded-lg border border-fog bg-background text-ink focus:border-hp-primary focus:ring-1 focus:ring-hp-primary outline-none transition-all"
                                        placeholder="e.g. Block A, UDOM Campus"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-ink flex items-center justify-between">
                                        <span>Pin your location on the map</span>
                                        <span className="text-xs text-hp-primary font-normal">Click map to move pin</span>
                                    </label>
                                    <div className="h-64 w-full rounded-lg overflow-hidden border border-fog z-0 relative">
                                        <MapContainer 
                                            center={[-6.1630, 35.7516]} // Default to Dodoma
                                            zoom={13} 
                                            style={{ height: '100%', width: '100%', zIndex: 0 }}
                                        >
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <LocationPicker 
                                                position={[parseFloat(formData.latitude), parseFloat(formData.longitude)]} 
                                                setPosition={([lat, lng]) => setFormData(prev => ({ ...prev, latitude: lat.toString(), longitude: lng.toString() }))} 
                                            />
                                        </MapContainer>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-steel">Selected Latitude</label>
                                        <input 
                                            name="latitude" 
                                            type="number"
                                            step="any"
                                            value={formData.latitude} 
                                            readOnly
                                            className="w-full p-2 rounded-lg border border-fog bg-cloud text-ink text-sm outline-none cursor-not-allowed opacity-70"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-steel">Selected Longitude</label>
                                        <input 
                                            name="longitude" 
                                            type="number"
                                            step="any"
                                            value={formData.longitude} 
                                            readOnly
                                            className="w-full p-2 rounded-lg border border-fog bg-cloud text-ink text-sm outline-none cursor-not-allowed opacity-70"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3 p-4 rounded-xl border border-fog bg-cloud/50 hover:border-hp-primary/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-bold text-ink">B&W Print</label>
                                            <span className="text-xs font-medium text-steel px-2 py-1 bg-canvas rounded-md border border-fog">per page</span>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-steel font-medium">TZS</span>
                                            <input 
                                                name="bwPrice" 
                                                type="number"
                                                value={formData.bwPrice} 
                                                onChange={handleChange} 
                                                className="w-full pl-12 p-3 rounded-lg border border-fog bg-background text-ink focus:border-hp-primary focus:ring-1 focus:ring-hp-primary outline-none transition-all font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3 p-4 rounded-xl border border-fog bg-cloud/50 hover:border-hp-primary/30 transition-colors">
                                        <div className="flex items-center justify-between">
                                            <label className="text-sm font-bold text-ink">Color Print</label>
                                            <span className="text-xs font-medium text-steel px-2 py-1 bg-canvas rounded-md border border-fog">per page</span>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-steel font-medium">TZS</span>
                                            <input 
                                                name="colorPrice" 
                                                type="number"
                                                value={formData.colorPrice} 
                                                onChange={handleChange} 
                                                className="w-full pl-12 p-3 rounded-lg border border-fog bg-background text-ink focus:border-hp-primary focus:ring-1 focus:ring-hp-primary outline-none transition-all font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="pt-6 flex items-center justify-between border-t border-fog mt-8">
                            <Button 
                                variant="outline" 
                                onClick={handleBack} 
                                disabled={step === 1 || loading}
                                className="bg-canvas border-fog text-steel hover:text-ink hover:bg-cloud"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                            
                            {step < 3 ? (
                                <Button 
                                    onClick={handleNext} 
                                    className="bg-hp-primary hover:bg-hp-primary/90 text-white"
                                >
                                    Next <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button 
                                    onClick={handleSubmit} 
                                    disabled={loading}
                                    className="bg-hp-primary hover:bg-hp-primary/90 text-white min-w-[140px]"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                                    Launch Shop
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
