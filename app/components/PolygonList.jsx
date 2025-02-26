"use client";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { POLYGON_COLOR_EDITED } from "@/app/redux/mapCRUD/actionTypes";
import { HexAlphaColorPicker, HexColorInput } from "react-colorful";

export default function PolygonList() {
  const mapData = useSelector((state) => state.mapData);
  const dispatch = useDispatch();

  const [activePolygon, setActivePolygon] = useState(null);
  const [colorType, setColorType] = useState("");
  const [color, setColor] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPolygons = mapData.filter((polygon) =>
    polygon.id.toString().includes(searchTerm)
  );

  const applyColorChange = (polygonId) => {
    if (color) {
      dispatch({
        type: POLYGON_COLOR_EDITED,
        payload: {
          id: polygonId,
          colorType,
          colorValue: color,
        },
      });
      resetState();
    }
  };

  const resetState = () => {
    setActivePolygon(null);
    setColor("");
    setColorType("");
  };

  return (
    <div className="list-wrapper ">
      <h2 className="list-title  ">Polygon List</h2>

      {/* Search Bar */}
      {mapData.length > 0 && (
        <input
          type="text"
          placeholder="Search by Polygon ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className=" search-input"
        />
      )}

      {filteredPolygons.length === 0 ? (
        <p>
          {mapData.length > 0
            ? "No matching polygons found."
            : "No polygons available."}
        </p>
      ) : (
        <ul className="list-data-wrapper">
          {filteredPolygons.map((polygon) => (
            <li key={polygon.id} className="list-item">
              <span>Polygon ID: {polygon.id}</span>
              <div className="  list-item-button-container">
                <div className="list-item-button-wrapper  ">
                  <button
                    onClick={() => {
                      setActivePolygon(polygon.id);
                      setColorType("stroke");
                    }}
                    className="button button-blue button-sm"
                  >
                    Change Stroke Color
                  </button>
                  <button
                    onClick={() => {
                      setActivePolygon(polygon.id);
                      setColorType("fill");
                    }}
                    className="button button-orange button-sm"
                  >
                    Change Fill Color
                  </button>
                </div>

                {/* Color Picker Dropdown */}
                {activePolygon === polygon.id && (
                  <div className="color-picker-container">
                    <div>
                      <HexAlphaColorPicker color={color} onChange={setColor} />
                      <HexColorInput
                        color={color}
                        onChange={setColor}
                        className="color-input"
                        placeholder="Type HEX Color Code (e.g., #000000)"
                      />
                    </div>

                    <div className="color-picker-button-wrapper">
                      <button
                        onClick={resetState}
                        className="button button-gray"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => applyColorChange(polygon.id)}
                        className="button button-blue"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
