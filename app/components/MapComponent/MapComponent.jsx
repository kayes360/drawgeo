"use client";
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import { TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css"; 
import * as turf from "@turf/turf";

import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useDispatch, useSelector } from "react-redux";
import {
  POLYGON_ADDED,
  POLYGON_AREA_EDITED,
  POLYGON_DELETED,
} from "@/app/redux/mapCRUD/actionTypes"; 
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

function MapUpdater({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return null;
}
const calculatePolygonArea = (latlngs) => {
  const coordinates = latlngs.map(({ lat, lng }) => [lng, lat]);
  coordinates.push(coordinates[0]);

  const polygon = turf.polygon([[...coordinates]]);
  const area = turf.area(polygon);
  return area.toFixed(2);
};

export default function Map() {
  const [position, setPosition] = useState([51.505, -0.09]);
  const [error, setError] = useState(null);
  const mapData = useSelector((state) => state.mapData);

  const dispatch = useDispatch();
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
        }
      );
    }
  }, []);

  const handleCreated = (e) => {
    console.log(e);
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const { _leaflet_id } = layer;
      const latlngs = layer.getLatLngs()[0];
      const area = calculatePolygonArea(latlngs);

      // Convert current polygon to Turf-compatible format
      const newCoordinates = latlngs.map(({ lat, lng }) => [lng, lat]);
      newCoordinates.push(newCoordinates[0]); // Close the polygon
      const newPolygon = turf.polygon([newCoordinates]);

      // Check for overlap with existing polygons
      let overlapDetected = false;

      mapData.forEach((existingPolygon) => {
        const existingCoordinates = existingPolygon.latlngs.map(
          ({ lat, lng }) => [lng, lat]
        );
        existingCoordinates.push(existingCoordinates[0]); // Close the polygon
        const existingTurfPolygon = turf.polygon([existingCoordinates]);

        if (turf.booleanOverlap(newPolygon, existingTurfPolygon)) {
          overlapDetected = true;
        }
      });

      if (overlapDetected) {
        setError("Error: Polygons cannot overlap.");
        layer.remove(); // Remove the invalid polygon
        return;
      }

      const newPolygonData = {
        id: _leaflet_id,
        latlngs,
        area,
      };
      dispatch({
        type: POLYGON_ADDED,
        payload: newPolygonData,
      });
    }
  };
  const handleEdited = (e) => {
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers)
      .map((layer) => ({
        id: layer._leaflet_id,
        latlngs: layer.editing.latlngs[0][0],
      }))
      .forEach((updatedPolygon) => {
        dispatch({
          type: POLYGON_AREA_EDITED,
          payload: updatedPolygon,
        });
      });
  };
  const handleDeleted = (e) => {
    console.log(e);
    const {
      layers: { _layers },
    } = e;

    Object.values(_layers).map(({ _leaflet_id }) => {
      //   setMapLayers((layers) => layers.filter((l) => l.id !== _leaflet_id));
      console.log(_leaflet_id);
      dispatch({
        type: POLYGON_DELETED,
        payload: _leaflet_id,
      });
    });
  };
  return ( 
      < >
        {error && <div className="text-danger">{error}</div>}
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "100%", width: "100%" }}
        >
          <MapUpdater position={position} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mapData?.map((polygon) => (
            <Polygon
              key={`${polygon.id}-${polygon.strokeColor}-${polygon.fillColor}`}
              positions={polygon.latlngs}
              color={polygon.strokeColor || "#7db5fa"}
              fillColor={polygon.fillColor || "#7db5fa"}
              fillOpacity={0.4}
            >
              <Tooltip sticky>Area: {polygon.area} m²</Tooltip>
            </Polygon>
          ))} 
          <FeatureGroup>
            <EditControl
              position="topright"
              onCreated={handleCreated}
              onEdited={handleEdited}
              onDeleted={handleDeleted}
              draw={{
                polygon: true,
                marker: true,
                rectangle: true,
                polyline: true,
                circle: true,
                circlemarker: false,
              }}
            />
          </FeatureGroup>

          <Marker position={position}>
            <Popup>Your location is approximately here!</Popup>
          </Marker> 
        </MapContainer>
      </>
     
  );
}
