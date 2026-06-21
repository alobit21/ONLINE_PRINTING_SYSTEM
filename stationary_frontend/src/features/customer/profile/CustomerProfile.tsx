import { User, Settings, Shield, LogOut, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import { Card } from '../../../components/ui/LegacyCard';
import { Button } from '../../../components/ui/LegacyButton';
import { useAuthStore } from '../../../stores/authStore';
import { cn } from '../../../lib/utils';

export const CustomerProfile = () => {
    const { user, logout } = useAuthStore();

    return (
        <div className="space-y-8 fade-in">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-hp-primary shadow-sm flex items-center justify-center text-white text-3xl font-black">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <button className="absolute bottom-0 right-0 h-8 w-8 bg-canvas rounded-full shadow-md flex items-center justify-center text-charcoal border border-fog hover:text-hp-primary transition-colors">
                        <Settings className="h-4 w-4" />
                    </button>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-ink">{user?.email?.split('@')[0]}</h2>
                    <p className="text-sm text-charcoal font-medium">Customer ID: 192837</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-fog shadow-sm bg-canvas rounded-[16px] p-6">
                    <h3 className="font-black mb-6 flex items-center gap-2 text-ink">
                        <User className="h-5 w-5 text-hp-primary" />
                        Account Information
                    </h3>
                    <div className="space-y-6">
                        <InfoRow icon={Mail} label="Email Address" value={user?.email || 'N/A'} />
                        <InfoRow icon={Phone} label="Phone Number" value="+1 234 567 890" />
                        <InfoRow icon={MapPin} label="Default Location" value="London, UK" />
                    </div>
                    <Button variant="outline" className="w-full mt-8 rounded-[4px] font-bold border border-fog text-charcoal hover:border-hp-primary hover:text-hp-primary hover:bg-cloud" title="Coming soon">Edit Details</Button>
                </Card>

                <div className="space-y-4">
                    <ProfileAction icon={Shield} title="Security & Privacy" description="Manage passwords and sessions." />
                    <ProfileAction icon={Settings} title="Preferences" description="Notifications and display settings." />
                    <ProfileAction
                        icon={LogOut}
                        title="Logout"
                        description="Sign out from your account."
                        danger
                        onClick={logout}
                    />
                </div>
            </div>
        </div>
    );
};

const InfoRow = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-xl bg-cloud flex items-center justify-center text-charcoal border border-fog">
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <p className="text-[10px] font-bold text-charcoal uppercase tracking-wider">{label}</p>
            <p className="text-sm font-bold text-ink">{value}</p>
        </div>
    </div>
);

const ProfileAction = ({ icon: Icon, title, description, danger, onClick }: any) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center justify-between p-4 rounded-[16px] border transition-all text-left bg-canvas shadow-sm",
            danger ? "border-red-200 hover:bg-red-50" : "border-fog hover:border-hp-primary hover:shadow-md"
        )}
    >
        <div className="flex items-center gap-4">
            <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center border",
                danger ? "bg-red-50 text-error border-red-200" : "bg-blue-50 text-hp-primary border-blue-100"
            )}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className={cn("font-bold text-sm", danger ? "text-error" : "text-ink")}>{title}</p>
                <p className="text-[10px] text-charcoal font-medium">{description}</p>
            </div>
        </div>
        <ChevronRight className={cn("h-5 w-5", danger ? "text-error" : "text-charcoal")} />
    </button>
);
