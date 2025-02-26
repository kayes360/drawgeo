import ExportImportComponent from "@/app/components/ExportImportComponent";
import { MapComponent } from "@/app/components/MapComponent";
import PolygonList from "@/app/components/PolygonList";

export default function Home() {
  return (
    <div className="main-container">
      <div className="map-column-wrapper">
        <ExportImportComponent />
        <MapComponent />
      </div>

      <div className="polygon-list-wrapper">
        <PolygonList />
      </div>
    </div>
  );
}
