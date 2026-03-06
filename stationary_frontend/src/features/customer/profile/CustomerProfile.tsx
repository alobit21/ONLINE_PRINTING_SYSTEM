import { User, Settings, Shield, LogOut, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { useAuthStore } from '../../../stores/authStore';
import { cn } from '../../../lib/utils';

export const CustomerProfile = () => {
    const { user, logout } = useAuthStore();

    return (
        <div className="space-y-8 fade-in">
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 border-4 border-slate-800 shadow-xl flex items-center justify-center text-white text-3xl font-black">
                        {user?.email?.charAt(0).toUpperCase()}
                    </div>
                    <button className="absolute bottom-0 right-0 h-8 w-8 bg-slate-800 rounded-full shadow-lg flex items-center justify-center text-slate-400 border border-slate-600 hover:text-cyan-400 transition-colors">
                        <Settings className="h-4 w-4" />
                    </button>
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-100">{user?.email?.split('@')[0]}</h2>
                    <p className="text-sm text-slate-400 font-medium">Customer ID: 192837</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-100">
                <Card className="border-none shadow-lg bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50">
                    <h3 className="font-black mb-6 flex items-center gap-2 text-slate-100">
                        <User className="h-5 w-5 text-cyan-400" />
                        Account Information
                    </h3>
                    <div className="space-y-6">
                        <InfoRow icon={Mail} label="Email Address" value={user?.email || 'N/A'} />
                        <InfoRow icon={Phone} label="Phone Number" value="+1 234 567 890" />
                        <InfoRow icon={MapPin} label="Default Location" value="London, UK" />
                    </div>
                    <Button variant="outline" className="w-full mt-8 rounded-xl font-bold border-2 border-slate-600 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-500/10">Edit Details</Button>
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
        <div className="h-10 w-10 rounded-xl bg-slate-700/50 flex items-center justify-center text-slate-400 border border-slate-600/50">
            <Icon className="h-5 w-5" />
        </div>
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-bold text-slate-100">{value}</p>
        </div>
    </div>
);

const ProfileAction = ({ icon: Icon, title, description, danger, onClick }: any) => (
    <button
        onClick={onClick}
        className={cn(
            "w-full flex items-center justify-between p-4 rounded-3xl border-2 transition-all text-left bg-slate-800/50",
            danger ? "border-red-500/20 hover:bg-red-500/10" : "border-slate-600/50 hover:border-cyan-500/50 hover:bg-cyan-500/5"
        )}
    >
        <div className="flex items-center gap-4">
            <div className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center shadow-sm border",
                danger ? "bg-red-500/20 text-red-400 border-red-400/30" : "bg-cyan-500/20 text-cyan-400 border-cyan-400/30"
            )}>
                <Icon className="h-5 w-5" />
            </div>
            <div>
                <p className={cn("font-bold text-sm", danger ? "text-red-400" : "text-slate-100")}>{title}</p>
                <p className="text-[10px] text-slate-400 font-medium">{description}</p>
            </div>
        </div>
        <ChevronRight className={cn("h-5 w-5", danger ? "text-red-300" : "text-slate-400")} />
    </button>
);
