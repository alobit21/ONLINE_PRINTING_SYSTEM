import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngBounds } from 'leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { useEffect } from 'react';

// Fix Leaflet's default icon path issues in React
const defaultIcon = new Icon({
    iconUrl: markerIconPng, // We might need to import explicit asset URL or copy to public
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// User location icon (blue)
const userIcon = new Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

// Component to adjust map bounds to show all markers
const MapBounds = ({ shops, userLocation }: { shops: any[], userLocation?: [number, number] }) => {
    const map = useMap();
    
    useEffect(() => {
        const coordinates = shops.map(shop => [shop.latitude, shop.longitude] as [number, number]);
        
        // Add user location to bounds if available
        if (userLocation) {
            coordinates.push(userLocation);
        }
        
        if (coordinates.length > 0) {
            const bounds = new LatLngBounds(coordinates);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [shops, userLocation, map]);

    return null;
};

interface ShopMapProps {
    shops: any[]; // Use Shop type
    center?: [number, number];
    userLocation?: [number, number];
}

export const ShopMap = ({ shops, center = [-6.17, 35.74], userLocation }: ShopMapProps) => {
    // Filter out shops without valid coordinates
    const validShops = shops.filter(shop => 
        shop && 
        shop.latitude !== null && 
        shop.longitude !== null && 
        !isNaN(shop.latitude) && 
        !isNaN(shop.longitude)
    );

    console.log('ShopMap - Valid shops:', validShops.length);
    console.log('ShopMap - Center:', center);
    console.log('ShopMap - User Location:', userLocation);
    console.log('ShopMap - Shops:', validShops.map(s => ({ name: s.name, lat: s.latitude, lng: s.longitude })));

    return (
        <MapContainer 
            center={center} 
            zoom={12} 
            scrollWheelZoom={false} 
            className="h-full w-full rounded-xl z-0"
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapBounds shops={validShops} userLocation={userLocation} />
            
            {/* User location marker */}
            {userLocation && (
                <Marker
                    position={userLocation}
                    icon={userIcon}
                >
                    <Popup>
                        <div className="text-center">
                            <h3 className="font-bold text-blue-600">Your Location</h3>
                            <p className="text-xs">{userLocation[0].toFixed(4)}, {userLocation[1].toFixed(4)}</p>
                        </div>
                    </Popup>
                </Marker>
            )}
            
            {/* Shop markers */}
            {validShops.map((shop) => (
                <Marker
                    key={shop.id}
                    position={[shop.latitude, shop.longitude]}
                    icon={defaultIcon}
                >
                    <Popup>
                        <div className="text-center">
                            <h3 className="font-bold">{shop.name}</h3>
                            <p className="text-xs">{shop.address}</p>
                            {shop.calculatedDistance && (
                                <p className="text-xs text-blue-600">
                                    {Number(shop.calculatedDistance).toFixed(1)} km away
                                </p>
                            )}
                            <br />
                            <a href={`/dashboard/shop/${shop.id}`} className="text-blue-600 text-xs">View Shop</a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};
