"use client";

import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { LabelList, Pie, PieChart } from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
} from "@/components/ui/chart";
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta";

export type ChannelDatum = {
	name: string;
	value: number;
	fill: string;
};

const defaultChartConfig = {
	value: {
		label: "Share",
	},
	"Pending": {
		label: "Pending",
		color: "var(--chart-1)",
	},
	"Completed": {
		label: "Completed",
		color: "var(--chart-3)",
	},
	"Cancelled": {
		label: "Cancelled",
		color: "var(--chart-5)",
	},
} satisfies ChartConfig;

interface Props extends ComponentProps<typeof Card> {
    chartData: ChannelDatum[];
    title?: string;
    description?: string;
    trendValue?: number;
}

export function ChannelBreakdownChart({
	className,
    chartData,
    title = "Traffic by channel",
    description = "Share of new conversations in last 7 days",
    trendValue,
	...props
}: Props) {
	return (
		<Card
			className={cn("flex flex-col shadow-none dark:ring-0", className)}
			{...props}
		>
			<CardHeader className="items-center space-y-1 pb-0 sm:items-start">
				<div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
					<CardTitle>{title}</CardTitle>
                    {trendValue !== undefined && (
					    <Delta value={trendValue} variant="badge">
						    <DeltaIcon variant="trend" />
						    <DeltaValue suffix="pp" />
					    </Delta>
                    )}
				</div>
				<CardDescription>
					{description}
				</CardDescription>
			</CardHeader>
			<CardContent className="my-auto">
				<ChartContainer
					className="mx-auto aspect-square max-h-72 w-full"
					config={defaultChartConfig}
				>
					<PieChart accessibilityLayer>
						<Pie
							cornerRadius={8}
							data={chartData}
							dataKey="value"
							innerRadius={36}
							nameKey="name"
							outerRadius="88%"
							stroke="var(--card)"
							strokeWidth={4}
						>
							<LabelList
								className="fill-background font-medium"
								dataKey="value"
								fill="currentColor"
								fontWeight={500}
								formatter={(label) => {
									const n = Number(label);
									return Number.isFinite(n) ? `${n}` : String(label ?? "");
								}}
								position="inside"
								stroke="none"
							/>
						</Pie>
						<ChartLegend content={<ChartLegendContent nameKey="name" />} />
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
