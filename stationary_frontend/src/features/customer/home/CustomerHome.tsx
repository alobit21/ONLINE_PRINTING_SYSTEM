import { useNavigate } from 'react-router-dom';
import { FileUp, Clock, MapPin, Zap, TrendingUp, ChevronRight, Star } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

export const CustomerHome = () => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8 fade-in">
            {/* Hero Welcome Card */}
            <div className="gradient-brand rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-brand-500/20">
                <div className="absolute top-0 right-0 h-64 w-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl animate-pulse" />
                <div className="absolute bottom-0 left-0 h-48 w-48 bg-brand-400/20 rounded-full -ml-24 -mb-24 blur-3xl" />

                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                        Need prints fast? <br />
                        <span className="text-brand-200">We've got you covered.</span>
                    </h2>
                    <p className="text-brand-100 mt-4 text-lg font-medium max-w-md">
                        The smartest way to upload, optimize, and print documents at nearby stations.
                    </p>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <Button
                            className="bg-white text-brand-700 hover:bg-brand-50 h-14 px-8 rounded-2xl font-bold shadow-xl flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
                            onClick={() => navigate('/dashboard/customer/upload')}
                        >
                            <FileUp className="h-6 w-6" />
                            Start New Job
                        </Button>
                        <Button
                            variant="ghost"
                            className="text-white hover:bg-white/10 h-14 px-8 rounded-2xl font-bold flex items-center gap-2"
                            onClick={() => navigate('/dashboard/customer/orders')}
                        >
                            Track Recent
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Background decoration icon */}
                <FileUp className="absolute right-12 bottom-12 h-48 w-48 text-white/5 rotate-12" />
            </div>

            {/* Quick Stats / Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickStat icon={Zap} label="Average Speed" value="12 mins" color="bg-amber-100 text-amber-600" />
                <QuickStat icon={MapPin} label="Nearby Shops" value="14 active" color="bg-blue-100 text-blue-600" />
                <QuickStat icon={TrendingUp} label="Total Saved" value="$42.50" color="bg-green-100 text-green-600" />
                <QuickStat icon={Clock} label="Recent Job" value="Completed" color="bg-purple-100 text-purple-600" />
            </div>

            {/* Section: Recent Orders */}
            <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                    <h3 className="text-xl font-bold text-slate-800">Recent Print Jobs</h3>
                    <Button variant="ghost" size="sm" className="text-brand-600 font-bold">See all</Button>
                </div>

                <div className="space-y-3">
                    <RecentJobCard
                        id="ORD-9281"
                        shop="City Print Central"
                        status="ready"
                        time="12 min ago"
                        price={4.50}
                        files={2}
                    />
                    <RecentJobCard
                        id="ORD-9275"
                        shop="Elite Stationery"
                        status="completed"
                        time="Yesterday"
                        price={12.80}
                        files={5}
                    />
                </div>
            </div>

            {/* Section: Recommended for You */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 px-2">Popular Nearby Stations</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                    <RecommendedShop name="Main Street Prints" rating={4.9} distance="0.8km" />
                    <RecommendedShop name="Campus Express" rating={4.7} distance="1.2km" />
                    <RecommendedShop name="QuickCopy Ltd" rating={4.8} distance="2.4km" />
                </div>
            </div>
        </div>
    );
};

const QuickStat = ({ icon: Icon, label, value, color }: any) => (
    <Card className="border-none shadow-md overflow-hidden bg-white/90 backdrop-blur-sm group hover:scale-105 transition-all">
        <CardContent className="p-4 flex flex-col items-center text-center">
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-2 shadow-sm", color)}>
                <Icon className="h-5 w-5" />
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-sm font-black text-slate-900 mt-0.5">{value}</p>
        </CardContent>
    </Card>
);

const RecentJobCard = ({ id, shop, status, time, price, files }: any) => (
    <Card className="border-none shadow-sm hover:shadow-md transition-all overflow-hidden bg-white/80 backdrop-blur-sm group">
        <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className={cn(
                    "h-12 w-12 rounded-2xl flex items-center justify-center shadow-lg",
                    status === 'ready' ? "bg-green-500 rotate-12" : "bg-slate-200"
                )}>
                    {status === 'ready' ? <Clock className="h-6 w-6 text-white" /> : <TrendingUp className="h-6 w-6 text-slate-400" />}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900">{id}</span>
                        <span className={cn(
                            "text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full",
                            status === 'ready' ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                        )}>
                            {status}
                        </span>
                    </div>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">{shop} • {files} files</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-black text-slate-900">${price.toFixed(2)}</p>
                <p className="text-[10px] font-medium text-slate-400">{time}</p>
            </div>
        </CardContent>
    </Card>
);

const RecommendedShop = ({ name, rating, distance }: any) => (
    <div className="min-w-[200px] bg-white rounded-3xl p-5 shadow-lg border border-slate-100 group cursor-pointer hover:border-brand-500 transition-all hover:scale-[1.02]">
        <div className="h-28 w-full bg-slate-100 rounded-2xl mb-4 overflow-hidden relative">
            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" alt={name} />
            <div className="absolute top-2 right-2 h-7 w-7 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center text-amber-600 shadow-sm">
                <Star className="h-3 w-3 fill-amber-500" />
                <span className="ml-1 text-[10px] font-bold">{rating}</span>
            </div>
        </div>
        <h4 className="font-bold text-slate-900 truncate">{name}</h4>
        <div className="flex items-center justify-between mt-2">
            <p className="text-xs font-bold text-slate-400">{distance}</p>
            <div className="flex items-center gap-1 text-xs font-black text-brand-600">
                View <ChevronRight className="h-3 w-3" />
            </div>
        </div>
    </div>
);
