import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Star, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Shop } from "../types";

interface ShopCardProps {
    shop: Shop;
}

export const ShopCard = ({ shop }: ShopCardProps) => {
    const navigate = useNavigate();

    return (
        <Card className="overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-32 bg-slate-200 relative">
                {shop.banner ? (
                    <img src={shop.banner} alt={shop.name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                        No Image
                    </div>
                )}
                {shop.rating !== undefined && (
                    <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        {shop.rating}
                    </div>
                )}
            </div>
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg">{shop.name}</CardTitle>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3 h-3" />
                    {shop.address}
                </p>
            </CardHeader>
            <CardContent className="p-4 pt-1">
                {shop.distance !== undefined && (
                    <p className="text-sm text-brand-600 font-medium">
                        {shop.distance.toFixed(1)} km away
                    </p>
                )}
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button
                    size="sm"
                    className="w-full"
                    onClick={() => navigate(`/dashboard/shop/${shop.id}`)}
                >
                    View Services
                </Button>
            </CardFooter>
        </Card>
    );
};
