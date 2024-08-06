import { Source as MapSource } from "react-map-gl";
import PropTypes from "prop-types";

function Source(props) {
  return <MapSource {...props}>{props?.children}</MapSource>;
}

Source.propTypes = {
  children: PropTypes.any,
};

export default Source;
