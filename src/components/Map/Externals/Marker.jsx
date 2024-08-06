import PropTypes from "prop-types";

import { Marker as MapMarker } from "react-map-gl";

function Marker(props) {
  return <MapMarker {...props}>{props?.children}</MapMarker>;
}

Marker.propTypes = {
  children: PropTypes.any,
};

export default Marker;
