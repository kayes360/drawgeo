"use client";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    POLYGON_ADDED
  } from "@/app/redux/mapCRUD/actionTypes";
export default function ExportImportComponent() {
  const mapData = useSelector((state) => state.mapData);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const handleExport = () => {
    if (mapData.length === 0) {
      setError("Error: No data to export.");
      return;
    }
    const jsonData = JSON.stringify(mapData, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Generate filename with timestamp using local time
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const filename = `mapData_${year}_${month}_${day}_${hours}_${minutes}_${seconds}.json`;

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };
  const handleImport = () => {
    fileInputRef.current.click();
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setError("Error: No file selected.");
      return;
    }
    if (file.type !== "application/json") {
      setError("Error: Please upload a valid JSON file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target.result);  
          if (Array.isArray(importedData)) { 
            const payloadData = importedData.map(item => ({
                id: item.id,
                latlngs: item.latlngs,
                area: item.area,
              }));
              console.log('payloadData',payloadData) 
            dispatch({
                    type: POLYGON_ADDED,
                    payload: payloadData,
                  });
            setError(null);  
          } else {
            setError("Error: Invalid JSON format.");
          }
        } catch (err) {
          setError("Error: Failed to parse JSON file.",err);
        }
      };
    reader.readAsText(file);
  };
  return (
    <div className="export-import-button-pair ">
      {error && <p className="text-danger">{error}</p>}
      <button
        onClick={handleExport}
        className="button button-blue"
      >
        Export Data
      </button>
      <button
        onClick={handleImport}
        className="button button-blue"
      >
        Import Data
      </button>
      <input
        type="file"
        accept="application/json"
        ref={fileInputRef}
        className="hide-element"
        onChange={handleFileChange}
      />
    </div>
  );
}


