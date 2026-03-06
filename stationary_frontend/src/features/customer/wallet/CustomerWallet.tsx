import { CreditCard, ArrowUpRight, History, Plus } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { cn } from '../../../lib/utils';

export const CustomerWallet = () => {
    return (
        <div className="space-y-8 fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-100">Your Wallet</h2>
                <p className="text-slate-400">Manage your credits and subscription plan.</p>
            </div>

            <Card className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl border border-cyan-400/30">
                <div className="absolute top-0 right-0 h-48 w-48 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl" />
                <div className="relative z-10">
                    <p className="text-cyan-100 font-medium">Available Balance</p>
                    <h3 className="text-5xl font-black mt-2">$124.50</h3>
                    <div className="mt-8 flex gap-4">
                        <Button className="bg-white text-cyan-700 hover:bg-cyan-50 rounded-xl font-bold px-6">
                            <Plus className="h-4 w-4 mr-2" /> Top Up
                        </Button>
                        <Button variant="ghost" className="text-white hover:bg-white/10 rounded-xl font-bold">
                            Withdraw
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-100">
                <Card className="border-none shadow-lg bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold flex items-center gap-2 text-slate-100">
                            <CreditCard className="h-5 w-5 text-cyan-400" />
                            Recent Transactions
                        </h3>
                        <Button variant="ghost" size="sm" className="text-cyan-400 text-xs font-bold hover:text-cyan-300 hover:bg-cyan-500/10">See all</Button>
                    </div>
                    <div className="space-y-4">
                        <TransactionItem title="Print Order #ORD-8291" date="Today" amount={-4.50} />
                        <TransactionItem title="Wallet Top Up" date="Yesterday" amount={50.00} />
                        <TransactionItem title="Subscription Renewal" date="Feb 1, 2026" amount={-15.00} />
                    </div>
                </Card>

                <Card className="border-none shadow-lg bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold flex items-center gap-2 text-slate-100">
                            <ArrowUpRight className="h-5 w-5 text-cyan-400" />
                            Active Subscription
                        </h3>
                    </div>
                    <div className="p-6 bg-slate-700/50 rounded-2xl border-2 border-slate-600/50 flex flex-col items-center text-center">
                        <div className="h-14 w-14 bg-cyan-500/20 rounded-2xl flex items-center justify-center text-cyan-400 mb-4 border border-cyan-400/30">
                            <History className="h-8 w-8 text-cyan-400" />
                        </div>
                        <h4 className="text-xl font-black text-slate-100">Student Pro</h4>
                        <p className="text-slate-400 text-xs mt-1">Next renewal: March 1, 2026</p>
                        <Button className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold hover:from-cyan-700 hover:to-blue-700 border border-cyan-400/30">Manage Plan</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const TransactionItem = ({ title, date, amount }: any) => (
    <div className="flex justify-between items-center p-3 hover:bg-slate-700/30 rounded-xl transition-colors">
        <div>
            <p className="font-bold text-sm text-slate-100">{title}</p>
            <p className="text-[10px] text-slate-400 font-medium">{date}</p>
        </div>
        <p className={cn("font-black", amount < 0 ? "text-red-400" : "text-green-400")}>
            {amount < 0 ? '-' : '+'}${Math.abs(amount).toFixed(2)}
        </p>
    </div>
);
