import React, { useEffect, useRef, useState } from "react";
import LocationsMap, {
  GoogleMapsClusteredWrapper,
  GoogleMapsGeocoderProvider,
} from "@smartimpact-it/locations-map";

const ShippingAddressMap = () => {
  const [shippingAddress, setShippingAddress] = useState<string>("");
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const mapProvider = new GoogleMapsClusteredWrapper({
        apiSettings: {
          apiKey: "YOUR_GOOGLE_MAPS_API_KEY",
        },
      });

      const searchProvider = new GoogleMapsGeocoderProvider();

      const locationsMap = new LocationsMap(mapContainerRef.current, {
        latitude: 44.1,
        longitude: 10.3,
        zoom: 8,
        displaySearch: true,
        searchProvider,
        mapProvider,
      });
    }
  }, []);

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={shippingAddress}
        onChange={(e) => setShippingAddress(e.target.value)}
        className="w-full p-2 rounded-md border border-gray-300 text-sm"
        placeholder="Enter your shipping address"
        required
      />
      <div className="flex justify-center items-center space-y-2">
        <div className="text-center w-full">
          <button
            type="button"
            className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
          >
            Search Address
          </button>
          <button
            type="button"
            className="px-4 py-2 ml-2 text-white bg-gray-500 hover:bg-gray-600 rounded-md"
            data-geolocate-trigger
          >
            Geolocate Me
          </button>
        </div>
      </div>
      <div ref={mapContainerRef} className="w-full h-96 rounded-md border border-gray-300 mt-4" />
    </div>
  );
};

export default ShippingAddressMap;
