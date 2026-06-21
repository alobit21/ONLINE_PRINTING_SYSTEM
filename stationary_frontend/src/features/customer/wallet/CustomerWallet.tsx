import { CreditCard, ArrowUpRight, History, Plus } from 'lucide-react';
import { Card } from '../../../components/ui/LegacyCard';
import { Button } from '../../../components/ui/LegacyButton';
import { cn } from '../../../lib/utils';

export const CustomerWallet = () => {
    return (
        <div className="space-y-8 fade-in">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-ink">Your Wallet</h2>
                <p className="text-charcoal">Manage your credits and subscription plan.</p>
            </div>

            <Card className="bg-hp-primary rounded-[16px] p-8 text-white relative overflow-hidden shadow-sm">
                <div className="relative z-10">
                    <p className="text-blue-100 font-medium">Available Balance</p>
                    <h3 className="text-5xl font-black mt-2">$124.50</h3>
                    <div className="mt-8 flex gap-4">
                        <Button className="bg-white text-hp-primary hover:bg-cloud rounded-[4px] font-bold px-6">
                            <Plus className="h-4 w-4 mr-2" /> Top Up
                        </Button>
                        <Button variant="ghost" className="text-white hover:bg-white/10 rounded-[4px] font-bold">
                            Withdraw
                        </Button>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border border-fog shadow-sm bg-canvas rounded-[16px] p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold flex items-center gap-2 text-ink">
                            <CreditCard className="h-5 w-5 text-hp-primary" />
                            Recent Transactions
                        </h3>
                        <Button variant="ghost" size="sm" className="text-hp-primary text-xs font-bold hover:bg-cloud">See all</Button>
                    </div>
                    <div className="space-y-4">
                        <TransactionItem title="Print Order #ORD-8291" date="Today" amount={-4.50} />
                        <TransactionItem title="Wallet Top Up" date="Yesterday" amount={50.00} />
                        <TransactionItem title="Subscription Renewal" date="Feb 1, 2026" amount={-15.00} />
                    </div>
                </Card>

                <Card className="border border-fog shadow-sm bg-canvas rounded-[16px] p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold flex items-center gap-2 text-ink">
                            <ArrowUpRight className="h-5 w-5 text-hp-primary" />
                            Active Subscription
                        </h3>
                    </div>
                    <div className="p-6 bg-cloud rounded-[16px] border border-fog flex flex-col items-center text-center">
                        <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center text-hp-primary mb-4 border border-fog shadow-sm">
                            <History className="h-8 w-8 text-hp-primary" />
                        </div>
                        <h4 className="text-xl font-black text-ink">Student Pro</h4>
                        <p className="text-charcoal text-xs mt-1">Next renewal: March 1, 2026</p>
                        <Button className="mt-6 w-full rounded-[4px] bg-hp-primary text-white font-bold hover:bg-blue-800">Manage Plan</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const TransactionItem = ({ title, date, amount }: any) => (
    <div className="flex justify-between items-center p-3 hover:bg-cloud rounded-[8px] transition-colors">
        <div>
            <p className="font-bold text-sm text-ink">{title}</p>
            <p className="text-[10px] text-charcoal font-medium">{date}</p>
        </div>
        <p className={cn("font-black", amount < 0 ? "text-error" : "text-green-600")}>
            {amount < 0 ? '-' : '+'}${Math.abs(amount).toFixed(2)}
        </p>
    </div>
);
