import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon } from 'leaflet';
import markerIconPng from "leaflet/dist/images/marker-icon.png"

// Fix Leaflet's default icon path issues in React
const defaultIcon = new Icon({
    iconUrl: markerIconPng, // We might need to import explicit asset URL or copy to public
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

interface ShopMapProps {
    shops: any[]; // Use Shop type
    center?: [number, number];
}

export const ShopMap = ({ shops, center = [-6.17, 35.74] }: ShopMapProps) => {
    return (
        <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full rounded-xl z-0">
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {shops.map((shop) => (
                <Marker
                    key={shop.id}
                    position={[shop.latitude, shop.longitude]}
                // icon={defaultIcon} // Commenting out icon temporarily if types mismatch, standard marker is default
                >
                    <Popup>
                        <div className="text-center">
                            <h3 className="font-bold">{shop.name}</h3>
                            <p className="text-xs">{shop.address}</p>
                            <br />
                            <a href={`/dashboard/shop/${shop.id}`} className="text-blue-600 text-xs">View Shop</a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};
