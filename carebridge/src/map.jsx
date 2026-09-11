import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const FALLBACK_POSITION = [27.1767, 78.0081];
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

function distanceInKilometres(
  [latitudeA, longitudeA],
  [latitudeB, longitudeB],
) {
  const earthRadius = 6371;
  const latitudeDelta = ((latitudeB - latitudeA) * Math.PI) / 180;
  const longitudeDelta = ((longitudeB - longitudeA) * Math.PI) / 180;
  const latitudeARadians = (latitudeA * Math.PI) / 180;
  const latitudeBRadians = (latitudeB * Math.PI) / 180;
  const value =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(latitudeARadians) *
      Math.cos(latitudeBRadians) *
      Math.sin(longitudeDelta / 2) ** 2;

  return earthRadius * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function Map({ locateRequest }) {
  const [position, setPosition] = useState(FALLBACK_POSITION);
  const [locationStatus, setLocationStatus] = useState("locating");
  const [hospitals, setHospitals] = useState([]);
  const [hospitalStatus, setHospitalStatus] = useState("loading");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("unavailable");
      return;
    }

    setLocationStatus("locating");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setPosition([coords.latitude, coords.longitude]);
        setLocationStatus("live");
      },
      (error) => {
        setPosition(FALLBACK_POSITION);
        setLocationStatus(error.code === 1 ? "denied" : "fallback");
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000,
      },
    );
  }, [locateRequest]);

  useEffect(() => {
    const controller = new AbortController();
    const [latitude, longitude] = position;
    const query = `[out:json][timeout:20];(nwr["amenity"="hospital"](around:10000,${latitude},${longitude});nwr["healthcare"="hospital"](around:10000,${latitude},${longitude}););out center tags;`;

    setHospitalStatus("loading");
    fetch(OVERPASS_URL, {
      method: "POST",
      body: query,
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Hospital search failed");
        return response.json();
      })
      .then(({ elements }) => {
        const nearbyHospitals = elements
          .map((hospital) => {
            const hospitalLatitude = hospital.lat ?? hospital.center?.lat;
            const hospitalLongitude = hospital.lon ?? hospital.center?.lon;
            if (hospitalLatitude == null || hospitalLongitude == null)
              return null;

            const hospitalPosition = [hospitalLatitude, hospitalLongitude];
            return {
              id: `${hospital.type}-${hospital.id}`,
              name: hospital.tags?.name || "Unnamed hospital",
              position: hospitalPosition,
              distance: distanceInKilometres(position, hospitalPosition),
            };
          })
          .filter(Boolean)
          .sort(
            (hospitalA, hospitalB) => hospitalA.distance - hospitalB.distance,
          )
          .filter(
            (hospital, index, list) =>
              list.findIndex((item) => item.name === hospital.name) === index,
          )
          .slice(0, 5);

        setHospitals(nearbyHospitals);
        setHospitalStatus("ready");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setHospitalStatus("error");
      });

    return () => controller.abort();
  }, [position]);

  return (
    <>
      <MapContainer
        key={position.join(",")}
        center={position}
        zoom={13}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position}>
          <Popup>📍 Your location</Popup>
        </Marker>

        {hospitals.map((hospital) => (
          <Marker key={hospital.id} position={hospital.position}>
            <Popup>
              <strong>{hospital.name}</strong>
              <br />
              {hospital.distance.toFixed(1)} km away
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="hospital-results" aria-live="polite">
        <h3>Nearest hospitals</h3>
        <p className="location-status">
          {locationStatus === "locating" &&
            "Getting your exact GPS location..."}
          {locationStatus === "live" && "Using your live GPS location."}
          {locationStatus === "denied" &&
            "Location permission was denied. Allow location access and try again."}
          {locationStatus === "fallback" &&
            "GPS could not be reached. Showing the fallback map area."}
          {locationStatus === "unavailable" &&
            "This browser does not support location services."}
        </p>
        {hospitalStatus === "loading" && <p>Searching nearby hospitals...</p>}
        {hospitalStatus === "error" && (
          <p>Hospital search is unavailable right now. Please try again.</p>
        )}
        {hospitalStatus === "ready" && hospitals.length === 0 && (
          <p>No hospitals found within 10 km.</p>
        )}
        {hospitals.length > 0 && (
          <ol>
            {hospitals.map((hospital) => (
              <li key={hospital.id}>
                <span>{hospital.name}</span>
                <small>{hospital.distance.toFixed(1)} km away</small>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}

export default Map;
