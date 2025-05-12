import React, { useState, useRef } from "react";
import { Button } from "antd";
import { Polygon, useGoogleMap } from "@react-google-maps/api";

const TerritoryManager = () => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]);
  const [polygons, setPolygons] = useState([]); 
  const map = useGoogleMap();
  const drawingManagerRef = useRef(null);

  const startDrawing = () => {
    if (!window.google) return;

    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
      drawingControl: false,
      polygonOptions: {
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        strokeWeight: 2,
        clickable: true,
        editable: true,
        draggable: true,
      },
    });

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;
    setIsDrawing(true);

    window.google.maps.event.addListener(drawingManager, "overlaycomplete", (event) => {
      const newPolygon = event.overlay;
      const pathArray = newPolygon.getPath().getArray().map((latLng) => ({
        lat: latLng.lat(),
        lng: latLng.lng(),
      }));

      setPaths((prevPaths) => [...prevPaths, pathArray]);
      setPolygons((prevPolygons) => [...prevPolygons, newPolygon]);

      drawingManager.setDrawingMode(null);
      setIsDrawing(false);
    });
  };

  const clearTerritories = () => {
    
    polygons.forEach((polygon) => {
      polygon.setMap(null);
    });

    
    setPaths([]);
    setPolygons([]);
  };

  return (
    <>
      <div style={{ position: "absolute", bottom: "20px", left: "20px", zIndex: 1000 }}>
        <Button className="map-settings-button" onClick={startDrawing} disabled={isDrawing}>
          {isDrawing ? "Drawing..." : "Create Territory"}
        </Button>
        <Button 
          type="danger" 
          onClick={clearTerritories} 
          style={{
            marginLeft: "10px",
            padding: "8px 16px", 
            border: "2px solid red", 
            backgroundColor: "#ff4d4f", 
            color: "white",
            fontWeight: "bold", 
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", 
          }}
        >
          Clear Territories
        </Button>
      </div>

      
      {paths.map((path, index) => (
        <Polygon
          key={index}
          paths={path}
          options={{
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            strokeWeight: 2,
            clickable: true,
            editable: true,
            draggable: true,
          }}
        />
      ))}
    </>
  );
};

export default TerritoryManager;
