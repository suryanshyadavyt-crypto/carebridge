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

const FALLBACK_POSITIONS = [
  [28.6139, 77.209],
  [26.9124, 75.7873],
  [26.8467, 80.9462],
  [25.5941, 85.1376],
  [23.2599, 77.4126],
];
const OVERPASS_URL = "https://overpass-api.de/api/interpreter";

function getRandomFallbackPosition() {
  return FALLBACK_POSITIONS[
    Math.floor(Math.random() * FALLBACK_POSITIONS.length)
  ];
}

const appointmentSlots = ["09:30 AM", "11:00 AM", "02:30 PM", "04:00 PM"];

function hospitalDetails(hospital) {
  const tags = hospital.tags || {};
  return {
    ...hospital,
    address:
      [tags["addr:housenumber"], tags["addr:street"], tags["addr:city"]]
        .filter(Boolean)
        .join(", ") || "Address available after contacting the hospital",
    phone:
      tags.phone ||
      tags["contact:phone"] ||
      "Contact hospital for phone number",
    hours: tags.opening_hours || "Hours not listed; call before visiting",
    slots: appointmentSlots.slice(0, 2 + (hospital.id.length % 3)),
  };
}

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

function Map({ locateRequest, onHospitalSelect }) {
  const [fallbackPosition] = useState(getRandomFallbackPosition);
  const [position, setPosition] = useState(fallbackPosition);
  const [locationStatus, setLocationStatus] = useState("locating");
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [totalHospitalCount, setTotalHospitalCount] = useState(0);
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
        setPosition(fallbackPosition);
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
              tags: hospital.tags || {},
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
          );

        const detailedHospitals = nearbyHospitals.map(hospitalDetails);
        setTotalHospitalCount(detailedHospitals.length);
        setHospitals(detailedHospitals.slice(0, 5));
        setSelectedHospital((current) =>
          current
            ? detailedHospitals.find(
                (hospital) => hospital.id === current.id,
              ) || null
            : null,
        );
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
          <Popup>
            {locationStatus === "live"
              ? "📍 Your current location"
              : "📍 Random fallback location"}
          </Popup>
        </Marker>

        {hospitals.map((hospital) => (
          <Marker
            key={hospital.id}
            position={hospital.position}
            eventHandlers={{
              click: () => {
                setSelectedHospital(hospital);
                onHospitalSelect?.(hospital);
              },
            }}
          >
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
            "Permission not given. Failed to fetch current location. Showing a random fallback area."}
          {locationStatus === "fallback" &&
            "Failed to fetch current location. Showing a random fallback area."}
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
        {hospitalStatus === "ready" && (
          <div
            className={`care-capacity ${totalHospitalCount < 3 ? "shortage" : "available"}`}
          >
            <div className="care-capacity-heading">
              <strong>
                {totalHospitalCount < 3
                  ? "Limited healthcare availability"
                  : "Healthcare availability looks good"}
              </strong>
              <span>
                {totalHospitalCount} hospitals within 10 km
                <span
                  className="capacity-info"
                  data-tooltip="Low: fewer than 3 hospitals within 10 km. High: 3 or more hospitals within 10 km. This is an estimate from map data, not live staffing information."
                  aria-label="Availability standards"
                  tabIndex="0"
                >
                  i
                </span>
              </span>
            </div>
            <div
              className="care-capacity-track"
              aria-label={`${hospitals.length} nearby hospitals found`}
            >
              <span
                style={{ width: `${Math.min(totalHospitalCount * 20, 100)}%` }}
              ></span>
            </div>
            <p>
              {totalHospitalCount < 3
                ? "There may be a shortage of hospitals or doctors in this area. Call ahead to confirm availability or expand your search."
                : "Several nearby hospitals were found. Call ahead to check doctor availability and waiting times."}
            </p>
          </div>
        )}
        {hospitals.length > 0 && (
          <ol>
            {hospitals.map((hospital) => (
              <li key={hospital.id}>
                <button
                  type="button"
                  className={`hospital-choice ${selectedHospital?.id === hospital.id ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedHospital(hospital);
                    onHospitalSelect?.(hospital);
                  }}
                >
                  <span>{hospital.name}</span>
                  <small>{hospital.distance.toFixed(1)} km away</small>
                </button>
              </li>
            ))}
          </ol>
        )}
        {selectedHospital && (
          <section className="hospital-details" aria-live="polite">
            <p className="details-label">Selected hospital</p>
            <h3>{selectedHospital.name}</h3>
            <p>{selectedHospital.address}</p>
            <p>
              <strong>Hours:</strong> {selectedHospital.hours}
            </p>
            <p>
              <strong>Phone:</strong> {selectedHospital.phone}
            </p>
            <div className="appointment-slots">
              <strong>Suggested appointment slots</strong>
              <div>
                {selectedHospital.slots.map((slot) => (
                  <span key={slot}>{slot}</span>
                ))}
              </div>
            </div>
            <a
              className="route-button"
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.position[0]},${selectedHospital.position[1]}`}
              target="_blank"
              rel="noreferrer"
            >
              Show route to hospital ↗
            </a>
          </section>
        )}
      </div>
    </>
  );
}

export default Map;
