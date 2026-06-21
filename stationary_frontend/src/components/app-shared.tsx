import type { ReactNode } from "react";
import { LayoutGridIcon, ListChecksIcon, BarChart3Icon, MessageSquareTextIcon, UsersIcon, PlugIcon, SettingsIcon, HelpCircleIcon, ActivityIcon } from "lucide-react";

export type SidebarNavItem = {
	title: string;
	path?: string;
	icon?: ReactNode;
	isActive?: boolean;
	subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
	label?: string;
	items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
	{
		items: [
			{
				title: "Overview",
				path: "/dashboard/shop",
				icon: <LayoutGridIcon />,
				isActive: true,
			},
			{
				title: "Orders",
				path: "/dashboard/shop/orders",
				icon: <ListChecksIcon />,
			},
			{
				title: "Products & Pricing",
				path: "/dashboard/shop/products",
				icon: <PlugIcon />,
			},
			{
				title: "Analytics",
				path: "/dashboard/shop/analytics",
				icon: <BarChart3Icon />,
			},
			{
				title: "Settings",
				path: "/dashboard/shop/settings",
				icon: <SettingsIcon />,
			},
		],
	},
];

export const footerNavLinks: SidebarNavItem[] = [
	{
		title: "Help Center",
		path: "#/help",
		icon: (
			<HelpCircleIcon
			/>
		),
	},
	{
		title: "System status",
		path: "#/status",
		icon: (
			<ActivityIcon
			/>
		),
	},
];

export const navLinks: SidebarNavItem[] = [
	...navGroups.flatMap((group) =>
		group.items.flatMap((item) =>
			item.subItems?.length ? [item, ...item.subItems] : [item]
		)
	),
	...footerNavLinks,
];
