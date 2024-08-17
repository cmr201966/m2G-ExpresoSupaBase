import {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import loadable from "@loadable/component";

// @emotion/css
import { css } from "@emotion/css";

import PropTypes from "prop-types";

// local hooks
import { useMapBox } from "./map-box-util";
import "mapbox-gl/dist/mapbox-gl.css";

import config from "../../config";

const Route = loadable(() => import("./Route"));
const Place = loadable(() => import("./Place"));
const Places = loadable(() => import("./Places"));
const Map = loadable(() => import("./Externals/Map"));
const PlacePopup = loadable(() => import("./PlacePopup"));

// added the following 6 lines.
// eslint-disable-next-line no-unused-vars
const mapboxgl = loadable(() => import("mapbox-gl"));

// styles
// import "./style.css";

function MapBox({
  coordinates,
  points,
  point,
  flyTo,
  visible,
  sx,
  style,
  remoteZoom,
  tindex,
  lat,
  lng,
  onLoadMap,
  noLocalMarker = true,
  onMapClick,
}) {
  console.log("Index", tindex);
  const [mindex, setMindex] = useState(tindex ?? 0);
  const [zoom, setZoom] = useState(remoteZoom ?? 16);
  const [longitude, setLongitude] = useState(lng ?? -75.829090519);
  const [latitude, setLatitude] = useState(lat ?? 20.0217583);
  const [localMarker, setLocalMarker] = useState(null);

  const flyToPoint = useCallback(
    (longitude, latitude, zoom) => {
      map?.current?.flyTo({
        center: [longitude, latitude],
        zoom,
      });
      if (!noLocalMarker) setLocalMarker({ lat: latitude, lng: longitude });
    },
    [noLocalMarker]
  );

  useEffect(() => {
    flyToPoint(longitude, latitude, zoom);
  }, [flyToPoint, latitude, longitude, zoom]);

  const onLocalMapClick = useCallback(
    (e) => {
      if (onMapClick) onMapClick(e.point, e.lngLat.wrap());
      else {
        setLatitude(e.lngLat.wrap().lat);
        setLongitude(e.lngLat.wrap().lng);
      }
    },
    [onMapClick]
  );

  const [_viewState, setViewState] = useState({
    longitude,
    latitude,
    zoom,
    bearing: 0,
    pitch: 0,
    width: "100%",
    height: "100%",
  });

  const map = useRef();

  const [width, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const viewState = useMemo(() => _viewState, [_viewState]);

  const { updateRoute, onSelectPoint, routeData, popupInfo, setPopupInfo } =
    useMapBox({
      coordinates,
      flyTo,
      map,
    });

  useEffect(() => {
    if (map.current) {
      map?.current.resize();
    }
  }, [width, visible]);

  useEffect(() => {
    if (coordinates) {
      updateRoute();
    }
  }, [coordinates, updateRoute]);

  useEffect(() => {
    if (!flyTo) return;
    else onSelectPoint();
  }, [flyTo, onSelectPoint]);

  useLayoutEffect(() => {
    if (!point) return;
    else {
      map?.current?.flyTo({
        center: [point.lng, point.lat],
        duration: 1000,
        zoom,
      });
    }
  }, [point, zoom]);

  const handleViewportChange = useCallback(
    (viewport) => {
      setViewState({
        viewport: { ...viewState, ...viewport },
      });
    },
    [onLoadMap, viewState]
  );

  useEffect(() => {
    if (onLoadMap) onLoadMap();
  }, [onLoadMap]);

  return (
    <div id="map-container" className={css({ ...sx })}>
      <Map
        ref={map}
        initialViewState={viewState}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={config.mapBoxAPI}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={onLocalMapClick}
        onViewportChange={handleViewportChange}
        cooperativeGestures
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "15px",
          ...style,
        }}
      >
        {localMarker && (
          <Place point={localMarker}>
            <div
              className={css({
                background: "dodgerblue",
                width: "20px",
                height: "20px",
                borderRadius: "100%",
              })}
            ></div>
          </Place>
        )}
        {point && <Place point={point} setPopupInfo={setPopupInfo} />}
        {points && <Places points={points} setPopupInfo={setPopupInfo} />}
        {popupInfo && (
          <PlacePopup popupInfo={popupInfo} setPopupInfo={setPopupInfo} />
        )}
        {routeData && <Route routeData={routeData} />}
      </Map>
    </div>
  );
}

MapBox.defaultProps = {
  width: "100%",
  height: "100%",
  sx: {
    width: "100%",
    height: "100%",
  },
};

MapBox.propTypes = {
  /*  visible: PropTypes.bool.isRequired, */
  width: PropTypes.string,
  height: PropTypes.string,
  point: PropTypes.any,
  coordinates: PropTypes.object,
  points: PropTypes.array,
  flyTo: PropTypes.object,
  visible: PropTypes.object,
  sx: PropTypes.object,
  style: PropTypes.object,
  onLoadMap: PropTypes.func,
  onMapClick: PropTypes.func,
  remotesShowMap: PropTypes.bool,
  index:  PropTypes.number,
  lat: PropTypes.number,
  lng: PropTypes.number,
  onChangeMap: PropTypes.func,
  remoteZoom: PropTypes.any,
};

export default MapBox;
