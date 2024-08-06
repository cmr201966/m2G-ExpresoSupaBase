import { memo } from "react";
import PropTypes from "prop-types";
import loadable from "@loadable/component";

// externals
const Pin = loadable(() => import("./Pin"));
const Marker = loadable(() => import("./Externals/Marker"));

function Place({ children, point, setPopupInfo }) {
  return (
    <Marker
      longitude={point.lng}
      latitude={point.lat}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        if (setPopupInfo) setPopupInfo(point);
      }}
    >
      {children ?? (
        <Pin
          imagePlace={
            point?.image ??
            "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png"
          }
        />
      )}
    </Marker>
  );
}

Place.propTypes = {
  point: PropTypes.any,
  children: PropTypes.any,
  setPopupInfo: PropTypes.func,
};

const PlaceMemo = memo(Place);

export default PlaceMemo;
