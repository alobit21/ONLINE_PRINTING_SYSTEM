import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/LegacyCard';
import { Button } from '../../components/ui/LegacyButton';
import { Input } from '../../components/ui/LegacyInput';
import { Settings, Save, Store, MapPin, Bell, Shield, LogOut } from 'lucide-react';

export function ShopSettingsPage() {
    return (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Center Column: Settings Forms */}
            <div className="xl:col-span-3 space-y-6">
                {/* Header */}
                <div className="mb-4">
                    <h1 className="text-2xl font-bold text-ink">Shop Settings</h1>
                    <p className="text-steel mt-1">Manage your shop profile, location, and operational preferences.</p>
                </div>

                <Card className="bg-cloud border-fog shadow-sm">
                    <CardHeader className="border-b border-fog bg-paper rounded-t-xl pb-4">
                        <CardTitle className="text-lg font-bold text-ink flex items-center gap-2">
                            <Store className="h-5 w-5 text-hp-primary" />
                            General Information
                        </CardTitle>
                        <CardDescription className="text-steel">Update your shop's core details</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-ink">Shop Name</label>
                                <Input defaultValue="My Print Shop" className="bg-cloud border-fog text-ink" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-ink">Contact Email</label>
                                <Input type="email" defaultValue="shop@example.com" className="bg-cloud border-fog text-ink" />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-ink">Description</label>
                                <textarea 
                                    className="w-full flex min-h-[80px] rounded-md border border-fog bg-cloud px-3 py-2 text-sm text-ink placeholder:text-steel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hp-primary focus-visible:ring-offset-2"
                                    defaultValue="Professional printing services for all your needs."
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-cloud border-fog shadow-sm">
                    <CardHeader className="border-b border-fog bg-paper rounded-t-xl pb-4">
                        <CardTitle className="text-lg font-bold text-ink flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-hp-primary" />
                            Location & Contact
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-ink">Physical Address</label>
                                <Input defaultValue="123 Main St, Dodoma" className="bg-cloud border-fog text-ink" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-ink">Phone Number</label>
                                <Input defaultValue="+255 123 456 789" className="bg-cloud border-fog text-ink" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column: Actions & Quick Links */}
            <div className="xl:col-span-1 space-y-6">
                <Card className="bg-cloud border-fog shadow-sm">
                    <CardHeader className="pb-3 border-b border-fog bg-paper rounded-t-xl">
                        <CardTitle className="text-lg font-bold text-ink flex items-center gap-2">
                            <Settings className="h-5 w-5 text-hp-primary" />
                            Actions
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                        <Button className="w-full bg-hp-primary text-white hover:bg-hp-primary/90 justify-center">
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                        </Button>
                        <div className="border-t border-fog my-4"></div>
                        <Button variant="outline" className="w-full justify-start border-fog text-ink hover:bg-paper">
                            <Bell className="h-4 w-4 mr-2" />
                            Notifications
                        </Button>
                        <Button variant="outline" className="w-full justify-start border-fog text-ink hover:bg-paper">
                            <Shield className="h-4 w-4 mr-2" />
                            Security
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-error/5 border-error/20 shadow-sm">
                    <CardHeader className="pb-3 border-b border-error/10 bg-error/10 rounded-t-xl">
                        <CardTitle className="text-lg font-bold text-error flex items-center gap-2">
                            Danger Zone
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        <p className="text-sm text-steel mb-4">
                            Once you delete your shop, there is no going back. Please be certain.
                        </p>
                        <Button variant="outline" className="w-full justify-center border-error text-error hover:bg-error/20">
                            Deactivate Shop
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
