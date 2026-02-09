import { User, Settings, Shield, LogOut, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAuthStore } from '../../../stores/authStore';
import { cn } from '../../../lib/utils';

export const CustomerProfile = () => {
    const { user, logout } = useAuthStore();

    return (
        <div className="space-y-8 fade-in">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full gradient-brand border-4 border-white shadow-xl flex items-center justify-center text-white text-3xl font-black">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <button className="absolute bottom-0 right-0 h-8 w-8 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 border border-slate-100">
                        <Settings className="h-4 w-4" />
                    </button>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900">{user?.email?.split('@')[0]}</h2>
                    <p className="text-sm text-slate-500 font-medium">Customer ID: 192837</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-800">
                <Card className="border-none shadow-lg bg-white rounded-3xl p-6">
                    <h3 className="font-black mb-6 flex items-center gap-2">
                        <User className="h-5 w-5 text-brand-600" />
                        Account Information
                    </h3>
                    <div className="space-y-6">
                        <InfoRow icon={Mail} label="Email Address" value={user?.email || 'N/A'} />
                        <InfoRow icon={Phone} label="Phone Number" value="+1 234 567 890" />
                        <InfoRow icon={MapPin} label="Default Location" value="London, UK" />
                    </div>
                    <Button variant="outline" className="w-full mt-8 rounded-xl font-bold border-2">Edit Details</Button>
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
        <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-bold text-slate-900">{value}</p>
        </div>
    </div>
);

const ProfileAction = ({ icon: Icon, title, description, danger, onClick }: any) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center justify-between p-4 rounded-3xl border-2 transition-all text-left bg-white",
            danger ? "border-red-50 hover:bg-red-50/30" : "border-slate-50 hover:border-brand-50"
        )}
    >
        <div className="flex items-center gap-4">
            <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm",
                danger ? "bg-red-100 text-red-600" : "bg-brand-50 text-brand-600"
            )}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className={cn("font-bold text-sm", danger ? "text-red-600" : "text-slate-900")}>{title}</p>
                <p className="text-[10px] text-slate-400 font-medium">{description}</p>
            </div>
        </div>
        <ChevronRight className={cn("h-5 w-5", danger ? "text-red-300" : "text-slate-300")} />
    </button>
);
