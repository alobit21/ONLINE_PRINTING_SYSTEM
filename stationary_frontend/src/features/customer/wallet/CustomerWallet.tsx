import { Wallet, CreditCard, ArrowUpRight, History, Plus } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

export const CustomerWallet = () => {
    return (
        <div className="space-y-8 fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-900">Your Wallet</h2>
                <p className="text-slate-500">Manage your credits and subscription plan.</p>
            </div>

            <Card className="gradient-brand rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 h-48 w-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl" />
                <div className="relative z-10">
                    <p className="text-brand-100 font-medium">Available Balance</p>
                    <h3 className="text-5xl font-black mt-2">$124.50</h3>
                    <div className="mt-8 flex gap-4">
                        <Button className="bg-white text-brand-700 hover:bg-brand-50 rounded-xl font-bold px-6">
                            <Plus className="h-4 w-4 mr-2" /> Top Up
                        </Button>
                        <Button variant="ghost" className="text-white hover:bg-white/10 rounded-xl font-bold">
                            Withdraw
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-800">
                <Card className="border-none shadow-lg bg-white rounded-3xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-brand-600" />
                            Recent Transactions
                        </h3>
                        <Button variant="ghost" size="sm" className="text-brand-600 text-xs font-bold">See all</Button>
                    </div>
                    <div className="space-y-4">
                        <TransactionItem title="Print Order #ORD-8291" date="Today" amount={-4.50} />
                        <TransactionItem title="Wallet Top Up" date="Yesterday" amount={50.00} />
                        <TransactionItem title="Subscription Renewal" date="Feb 1, 2026" amount={-15.00} />
                    </div>
                </Card>

                <Card className="border-none shadow-lg bg-white rounded-3xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold flex items-center gap-2">
                            <ArrowUpRight className="h-5 w-5 text-brand-600" />
                            Active Subscription
                        </h3>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border-2 border-slate-100 flex flex-col items-center text-center">
                        <div className="h-14 w-14 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600 mb-4">
                            <History className="h-8 w-8 text-brand-600" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900">Student Pro</h4>
                        <p className="text-slate-500 text-xs mt-1">Next renewal: March 1, 2026</p>
                        <Button className="mt-6 w-full rounded-xl gradient-brand text-white font-bold">Manage Plan</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const TransactionItem = ({ title, date, amount }: any) => (
    <div className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-xl transition-colors">
        <div>
            <p className="font-bold text-sm">{title}</p>
            <p className="text-[10px] text-slate-400 font-medium">{date}</p>
        </div>
        <p className={cn("font-black", amount < 0 ? "text-red-500" : "text-green-500")}>
            {amount < 0 ? '-' : '+'}${Math.abs(amount).toFixed(2)}
        </p>
    </div>
);
