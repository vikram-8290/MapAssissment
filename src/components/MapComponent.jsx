import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsRenderer,
  Polygon,
  HeatmapLayer,
  TrafficLayer,
} from "@react-google-maps/api";
import { Button, Drawer, Spin } from "antd";
import SearchBar from "./SearchBar";
import MapSettings from "./MapSettings";
import TerritoryManager from "./TerritoryManager";
import { EnvironmentOutlined } from "@ant-design/icons";

const MapComponent = () => {
  const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 }); 
  const [currentLocation, setCurrentLocation] = useState(null);
  const [zoom, setZoom] = useState(5);
  const [mapType, setMapType] = useState("roadmap");
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [showGeofence, setShowGeofence] = useState(true);
  const [polygons, setPolygons] = useState([]);
  const [markerSize, setMarkerSize] = useState(10);
  const [directions, setDirections] = useState(null);
  const [destination, setDestination] = useState(null);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showPOI, setShowPOI] = useState(false);
  const [pois, setPois] = useState([]);
  const [locationDetails, setLocationDetails] = useState(null); 
  const [drawerVisible, setDrawerVisible] = useState(false); 
  const [loading, setLoading] = useState(false); 
  const [showCluster, setShowCluster] = useState(false);

  
  const heatmapPoints = [
    { lat: 28.6139, lng: 77.2090, weight: 10 },   // Delhi
    { lat: 19.0760, lng: 72.8777, weight: 15 },   // Mumbai
    { lat: 13.0827, lng: 80.2707, weight: 8 },    // Chennai
    { lat: 22.5726, lng: 88.3639, weight: 12 },   // Kolkata
    { lat: 12.9716, lng: 77.5946, weight: 9 },    // Bangalore
    { lat: 26.9124, lng: 75.7873, weight: 6 },    // Jaipur
    { lat: 23.0225, lng: 72.5714, weight: 7 },    // Ahmedabad
    { lat: 17.3850, lng: 78.4867, weight: 11 },   // Hyderabad
    { lat: 16.5062, lng: 80.6480, weight: 5 },    // Vijayawada
    { lat: 25.5941, lng: 85.1376, weight: 4 }     // Patna
  ];

  const mapRef = useRef(null);

  const [mapDimensions, setMapDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setMapDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);
        },
        (error) => {
          console.error("Error getting current location:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (destination) {
      setLoading(true);
      const directionsService = new window.google.maps.DirectionsService();

      const request = {
        origin: currentLocation,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      };

      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          setLoading(false);
        } else {
          console.error("Error fetching directions:", status);
          setLoading(false);
        }
      });
    }
  }, [destination, currentLocation]);

  const handleSearch = async (location) => {
    console.log("location", location);
    setDestination(location);
    setCenter(location);
  
    setLocationDetails({
      name: location.address,
      lat: location.lat,
      lng: location.lng,
    });
  
    if (currentLocation && currentLocation.lat && currentLocation.lng) {
      const directionsService = new window.google.maps.DirectionsService();
  
      const request = {
        origin: new window.google.maps.LatLng(currentLocation.lat, currentLocation.lng), 
        destination: new window.google.maps.LatLng(location.lat, location.lng), 
        travelMode: window.google.maps.TravelMode.DRIVING, 
      };
  
      directionsService.route(request, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          const estimatedTime = result.routes[0].legs[0].duration.text; 
  
          setLocationDetails((prevDetails) => ({
            ...prevDetails,
            estimatedTime,
          }));
  
        } else {
          console.error("Error fetching directions:", status);
        }
      });
    } else {
      console.error("Current location is not available.");
    }
  
    setDrawerVisible(true);
  };
  
  const handleClear = () => {
    setDestination(null);
    setDirections(null);
    setZoom(5);

    if (currentLocation) {
      setCenter(currentLocation);
    }
  };

  const handleGoToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);
          setCenter(location);
          setZoom(10);
        },
        (error) => {
          console.error("Error fetching current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const currentLocationIcon = useMemo(
    () => ({
      url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    }),
    []
  );

  const destinationIcon = useMemo(
    () => ({
      url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    }),
    []
  );

  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  const handleZoomChanged = () => {
    if (mapRef.current) {
      const newZoom = mapRef.current.getZoom();
      setZoom(newZoom);
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
      libraries={["places", "geometry", "drawing", "visualization"]}
    >
      <div style={{ display: "flex", position: "relative" }}>
        <div style={{ position: "absolute", bottom: "80px", left: "30px", zIndex: 1000 }}>
          <Button className="map-settings-button" onClick={handleGoToCurrentLocation}>
            <EnvironmentOutlined />
          </Button>
        </div>
        
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "140px",
            zIndex: 1000,
          }}
        >
          <MapSettings
            mapType={mapType}
            setMapType={setMapType}
            showHeatmap={showHeatmap}
            setShowHeatmap={setShowHeatmap}
            showGeofence={showGeofence}
            setShowGeofence={setShowGeofence}
            markerSize={markerSize}
            setMarkerSize={setMarkerSize}
            showTraffic={showTraffic}
            setShowTraffic={setShowTraffic}
            showPOI={showPOI}
            setShowPOI={setShowPOI}
            setShowCluster={setShowCluster}
            showCluster={showCluster}
          
          />
        </div>

        <div style={{ flex: 1, position: "relative" }}>
          <SearchBar
            setCenter={setCenter}
            onSearch={handleSearch}
            onClear={handleClear}
          />

          <GoogleMap
            mapContainerStyle={{
              width: mapDimensions.width,
              height: mapDimensions.height,
            }}
            center={center}
            zoom={zoom}
            mapTypeId={mapType}
            onLoad={handleMapLoad}
            onZoomChanged={handleZoomChanged}
          >
            {currentLocation && (
              <Marker position={currentLocation} icon={currentLocationIcon} />
            )}

            {destination && (
              <Marker position={destination} icon={destinationIcon} />
            )}

            {showTraffic && <TrafficLayer />}

            {showPOI &&
              pois.map((poi, index) => (
                <Marker
                  key={index}
                  position={poi.geometry.location}
                  label={poi.name}
                />
              ))}

            {showHeatmap ? (
              <HeatmapLayer
                data={heatmapPoints.map(point => {
                  const latLng = new window.google.maps.LatLng(point.lat, point.lng);
                  latLng.weight = point.weight;
                  return latLng;
                })}
                options={{
                  radius: 30,
                  opacity: 0.6,
                }}
              />
            ) : null}

            {showGeofence &&
              polygons.map((polygon, index) => (
                <Polygon
                  key={index}
                  paths={polygon}
                  options={{
                    fillColor: "#FF0000",
                    fillOpacity: 0.4,
                  }}
                />
              ))}

            {directions && <DirectionsRenderer directions={directions} />}

            <TerritoryManager
              addPolygon={(polygon) => setPolygons([...polygons, polygon])}
            />
          </GoogleMap>
        </div>
      </div>

      <Drawer
        title="Location Details"
        placement="left"
        closable={false}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width={300}
      >
        <Spin spinning={loading}>
          {locationDetails && (
            <div>
              <h3>{locationDetails.name}</h3>
              <p>Latitude: {locationDetails.lat}</p>
              <p>Longitude: {locationDetails.lng}</p>

              {locationDetails.estimatedTime && (
                <div>
                  <h4>Estimated Time: (in case of driving) {locationDetails.estimatedTime}</h4>
                </div>
              )}
            </div>
          )}
        </Spin>
      </Drawer>
    </LoadScript>
  );
};

export default MapComponent;