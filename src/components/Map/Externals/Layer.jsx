import PropTypes from "prop-types";

// react-map-gl
import { Layer as MapLayer } from "react-map-gl";

function Layer(props) {
  return <MapLayer {...props}>{props?.children}</MapLayer>;
}

Layer.propTypes = {
  children: PropTypes.any,
};

export default Layer;
