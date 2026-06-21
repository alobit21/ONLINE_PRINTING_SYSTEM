import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { MailIcon, MessageCircleIcon, ArrowRightIcon } from "lucide-react";

export type OrderRow = {
	id: string;
	customer: string;
	date: string;
	status: string;
	revenue: string;
};

function formatWaitTime(minutes: number): string {
	if (minutes <= 0) {
		return "Just now";
	}
	if (minutes === 1) {
		return "1 minute";
	}
	if (minutes < 55) {
		return `${minutes} minutes`;
	}
	if (minutes < 60) {
		return "Almost an hour";
	}
	if (minutes < 75) {
		return "About an hour";
	}
	if (minutes < 120) {
		return "Over an hour";
	}
	const hours = Math.round(minutes / 60);
	return hours === 1 ? "About an hour" : `About ${hours} hours`;
}

function statusVariant(
	state: string
): ComponentProps<typeof Badge>["variant"] {
	const s = state.toUpperCase();
	if (s === "UPLOADED" || s === "ACCEPTED" || s === "PRINTING") {
		return "default";
	}
	if (s === "CANCELLED") {
		return "destructive";
	}
	return "secondary";
}

interface Props extends ComponentProps<typeof Card> {
    orders: OrderRow[];
}

export function RecentConversations({
	className,
    orders,
	...props
}: Props) {
	return (
		<Card
			className={cn("gap-0 shadow-none md:col-span-2 dark:ring-0", className)}
			{...props}
		>
			<CardHeader className="border-b">
				<CardTitle>Recent Orders</CardTitle>
				<CardDescription>Latest threads from your shop</CardDescription>
			</CardHeader>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent">
							<TableHead className="pl-6">Order ID</TableHead>
							<TableHead>Customer</TableHead>
							<TableHead>Date</TableHead>
							<TableHead className="text-right">Status</TableHead>
							<TableHead className="pr-6 text-right">Revenue</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orders.map((r) => {
							return (
								<TableRow
									className="h-14 hover:bg-transparent"
									key={r.id}
								>
									<TableCell className="max-w-36 truncate pl-6 font-medium font-mono text-xs text-muted-foreground">
										{r.id.slice(0, 8).toUpperCase()}
									</TableCell>
									<TableCell>
										<span className="font-medium text-sm">
											{r.customer}
										</span>
									</TableCell>
									<TableCell className="text-muted-foreground text-sm">
										{r.date}
									</TableCell>
									<TableCell className="text-right">
										<Badge variant={statusVariant(r.status)}>
											{r.status}
										</Badge>
									</TableCell>
									<TableCell className="pr-6 text-right font-medium">
										TZS {r.revenue}
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
