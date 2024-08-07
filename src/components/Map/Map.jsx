import { useLayoutEffect, useEffect, useState, useRef } from "react";
import loadable from "@loadable/component";
// sito components
//import SitoContainer from "sito-container";

// react-map-gl
// eslint-disable-next-line no-unused-vars
import "mapbox-gl/dist/mapbox-gl.css";

//import mapboxgl from "!mapbox-gl";

// prop types
import PropTypes from "prop-types";

// @mui components
import { Box, Button } from "@mui/material";

// @mui icons
import MapIcon from "@mui/icons-material/Map";

// images
// import Crash from "assets/images/crash";
const mapboxgl = loadable(() => import("mapbox-gl"));
// styles
import "./style.css";

const Map = (props) => {
  const {
    onLoadMap,
    remoteshowMap,
    width,
    height,
    point,
    onMapClick,
    lng,
    lat,
    onChange,
    onChangeLng,
    onChangeLat,
    remoteZoom,
  } = props;

  const [apiMap, setApiMap] = useState("");
  const [points, setPoints] = useState([]);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [localLng, setLocalLng] = useState(lng);
  const [localLat, setLocalLat] = useState(lat);

  const [zoom, setZoom] = useState(remoteZoom);

  const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const [showMap, setShowMap] = useState(remoteshowMap);

  const localOnChangeLng = (e) => {
    const { value } = e.target;
    let onePoint = false;
    let newString = "";
    for (let i = 0; i < value.length; i += 1) {
      if (value[i] === "." && !onePoint) {
        onePoint = true;
        newString += value[i];
      } else if (value[i] === "-" && i === 0) newString += value[i];
      else if (numbers.indexOf(value[i]) > -1) newString += value[i];
    }
    if (onChange) onChange("lng", newString);
    else if (onChangeLng) onChangeLng(newString);
    setLocalLng(Number(newString));
  };

  const localOnChangeLat = (e) => {
    const { value } = e.target;
    let onePoint = false;
    let newString = "";
    for (let i = 0; i < value.length; i += 1) {
      if (value[i] === "." && !onePoint) {
        onePoint = true;
        newString += value[i];
      } else if (value[i] === "-" && i === 0) newString += value[i];
      else if (numbers.indexOf(value[i]) > -1) newString += value[i];
    }
    if (onChange) onChange("lat", newString);
    else if (onChangeLat) onChangeLat(newString);
    setLocalLat(Number(newString));
  };

  const init = async () => {
    try {
      setApiMap(
        "pk.eyJ1Ijoic2l0b25pbWJ1cyIsImEiOiJjbDF6Zm9pcDYwZzczM2RvYTI3Z2NyNWhpIn0.cNtfA_3cqsqoMO-QxEj2JQ"
      );
      const result = [];
      const localPoints = [];
      result.forEach((item) => {
        const { id, location, headerImages } = item;
        const { name, description } = item.texts;
        const [lng, lat] = location.split(",");
        localPoints.push({
          type: "Feature",
          geometry: { type: "Point", coordinates: [Number(lat), Number(lng)] },
          properties: {
            id,
            name,
            headerImages,
            description,
            type: "places",
            phoneFormatted: "(202) 234-7336",
            phone: "2022347336",
            address: "1471 P St NW",
            city: "Washington DC",
            country: "United States",
            crossStreet: "at 15th St NW",
            postalCode: "20005",
            state: "D.C.",
          },
        });
      });
      setPoints({ type: "FeatureCollection", features: localPoints });
    } catch (e) {
      console.log(e);
    }
  };

  useLayoutEffect(() => {
    init();
  }, []);

  const flyToPoint = (currentFeature) => {
    map.current.flyTo({
      center: currentFeature.geometry.coordinates,
      zoom: remoteZoom,
    });
  };

  useEffect(() => {
    if (localLng !== lng) setLocalLng(lng);
    if (localLat !== lat) setLocalLat(lat);
    if (map && map.current) {
      map.current
        .getSource("single-point")
        .setData({ coordinates: [lng, lat], type: "Point" });
      flyToPoint({ geometry: { coordinates: [lng, lat] } });
    }
  }, [lat, lng]);

  useEffect(() => {
    setShowMap(remoteshowMap);
  }, [remoteshowMap]);

  /* const createPopUp = (currentFeature) => {
    const popUps = document.getElementsByClassName("mapboxgl-popup");
    // Check if there is already a popup on the map and if so, remove it
    if (popUps[0]) popUps[0].remove();

    const { name, id, type, headerImages, description } = currentFeature.properties;

    // eslint-disable-next-line no-unused-vars
    new mapboxgl.Popup({ closeOnClick: true })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML(
        `<img src=${
          headerImages && headerImages[0] ? headerImages[0].url : ""
        } alt="place-image"/>` +
          `<div class="popup-content">` +
          `<h3 class="title">${name}</h3>` +
          `<p>${description}</p>` +
          `<h3><a href="${process.env.PUBLIC_URL}/details:${id}-${type}">${languageState.texts.Home.SeePlace}</a></h3></div>`
      )
      .addTo(map.current);
  }; */

  /* const addMarkers = () => {
    // For each feature in the GeoJSON object above:
    for (const marker of points.features) {
      // Create a div element for the marker.
      const el = document.createElement("div");
      // Assign a unique `id` to the marker.
      el.id = `marker-${marker.properties.id}`;
      // Assign the `marker` class to each marker for styling.
      el.className = "marker";
      // el.style.backgroundImage = `url('${pointImage}')`;

      el.addEventListener("click", (e) => {
        // Fly to the point
        flyToPoint(marker);
        // Close all other popups and display popup for clicked store
        createPopUp(marker);
        // Highlight listing in sidebar
        const activeItem = document.getElementsByClassName("active");
        e.stopPropagation();
        if (activeItem[0]) {
          activeItem[0].classList.remove("active");
        }
      });

      new mapboxgl.Marker(el, { offset: [0, -23] })
        .setLngLat(marker.geometry.coordinates)
        .addTo(map.current);
    }
  }; */

  useEffect(() => {
    if (apiMap === "" || !points.type) return;
    mapboxgl.accessToken = apiMap;
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [localLng, localLat],
      zoom,
    });
    map.current.on("move", () => {
      setLocalLng(map.current.getCenter().lng);
      setLocalLat(map.current.getCenter().lat);
      setZoom(map.current.getZoom().toFixed(2));
    });

    if (point !== "" && point !== 0) {
      const [lat, lng] = point.split(",");
      //      console.log(point);

      flyToPoint({ geometry: { coordinates: [lng, lat] } });
    }
    map.current.on("click", (event) => {
      /* Determine if a feature in the "locations" layer exists at that point. */
      const features = map.current.queryRenderedFeatures(event.point, {
        layers: ["point"],
      });

      /* If it does not exist, return */
      if (!features.length) return;

      const clickedPoint = features[0];

      /* Fly to the point */
      flyToPoint(clickedPoint);
    });
    // eslint-disable-next-line no-undef
    /* const geocoder = new MapboxGeocoder({
      // Initialize the geocoder
      accessToken: "pk.eyJ1Ijoic2l0b25pbWJ1cyIsImEiOiJjbDF6Zm9pcDYwZzczM2RvYTI3Z2NyNWhpIn0.cNtfA_3cqsqoMO-QxEj2JQ", // Set the access token
      mapboxgl: map.current, // Set the mapbox-gl instance
      marker: false, // Do not use the default marker style
      placeholder: "Escribe una direcciíon", // Placeholder text for the search bar
    }); */

    // Add the geocoder to the map
    // map.current.addControl(geocoder);
    map.current.on("load", () => {
      /* Add the data to your map as a layer */
      map.current.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        (error, image) => {
          if (error) return error;
          if (onLoadMap) onLoadMap();
          map.current.addImage("my-point", image);
          map.current.addSource("single-point", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [],
            },
          });

          map.current.addLayer({
            id: "point",
            source: "single-point",
            type: "circle",
            paint: {
              "circle-radius": 10,
              "circle-color": "#448ee4",
            },
          });
          map.current
            .getSource("single-point")
            .setData({ coordinates: [lng, lat], type: "Point" });

          /* geocoder.on("result", (event) => {
            map.current.getSource("single-point").setData(event.result.geometry);
          }); */
          /* map.current.addSource("places", {
            type: "geojson",
            data: points,
          }); */
          /* map.current.addLayer({
            id: "locations",
            type: "symbol",
            source: "places",
            layout: {
              "icon-image": "my-point",
              "icon-allow-overlap": false,
            },
          });

          // check if the Geolocation API is supported
          if (navigator.geolocation) {
            // navigator.geolocation.getCurrentPosition(onSuccess, onError);
            // Add geolocate control to the map.
            map.current.addControl(
              new mapboxgl.GeolocateControl({
                positionOptions: {
                  enableHighAccuracy: true,
                },
                // When active the map will receive updates to the device's location as it changes.
                trackUserLocation: true,
                // Draw an arrow next to the location dot to indicate which direction the device is heading.
                showUserHeading: true,
              })
            );
          } */
        }
      );

      /* addMarkers(); */

      // Listen for the `result` event from the Geocoder
      // `result` event is triggered when a user makes a selection
      //  Add a marker at the result's coordinates
    });
    map.current.on("click", (e) => {
      onMapClick(e.point, e.lngLat.wrap());
    });
  });

  return (
    <Box
      sx={{
        width,
        flex: 1,
        transition: "transform 500ms ease",
      }}
    >
      {(lng || lat) && (
        <>
          {lng && showMap && (
            <div className="input-area4">
              <label className="label-2">Longitud:</label>
              <input
                className="input-gps-lng"
                placeholder="Longitud"
                type="text"
                name="lng"
                id="lng"
                value={localLng}
                onChange={localOnChangeLng}
              />
            </div>
          )}
          {lat && showMap && (
            <div className="input-area4">
              <label className="label-2">Latitud:</label>
              <input
                className="input-gps-lat"
                placeholder="Latitud"
                type="text"
                name="lat"
                id="lat"
                value={localLat}
                onChange={localOnChangeLat}
              />
            </div>
          )}
        </>
      )}
      {/*
      <Button
        sx={{ minWidth: 0, padding: "10px", borderRadius: "100%", marginBottom: "10px" }}
        variant={showMap ? "contained" : "outlined"}
        onClick={() => setShowMap(!showMap)}
      >
        <MapIcon />
        </Button>
*/}
      <Box
        sx={{
          width,
          height,
          position: "relative",
          display: showMap ? "block" : "none",
        }}
      >
        <Box
          className="sidebar"
          sx={{
            backgroundColor: "rgba(35, 55, 75, 0.9)",
            color: "#fff",
            padding: "6px 12px",
            fontFamily: "monospace",
            zIndex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            margin: "12px",
            borderRadius: "4px",
          }}
        >
          {/*Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}*/}
        </Box>

        <Box
          ref={mapContainer}
          className="map-container"
          sx={{
            width,
            height,
          }}
        />
      </Box>
    </Box>
  );
};

Map.defaultProps = {
  width: "100%",
  height: "500px",
  point: 0,
  lng: -75.8290905,
  lat: 20.0217583,
  onChange: undefined,
  onChangeLng: undefined,
  onChangeLat: undefined,
};

Map.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
  point: PropTypes.string,
  onMapClick: PropTypes.func.isRequired,
  lng: PropTypes.number,
  lat: PropTypes.number,
  onChange: PropTypes.func,
  onChangeLng: PropTypes.func,
  onChangeLat: PropTypes.func,
};

export default Map;
