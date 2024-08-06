import { forwardRef } from "react";
import PropTypes from "prop-types";
import Map from "react-map-gl";

const LMap = forwardRef(function LMap(props, ref) {
  return (
    <Map ref={ref} {...props}>
      {props?.children}
    </Map>
  );
});

LMap.propTypes = {
  children: PropTypes.any,
};

export default LMap;
