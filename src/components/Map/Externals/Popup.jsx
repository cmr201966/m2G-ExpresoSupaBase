import { Popup as MapPopup } from "react-map-gl";
import PropTypes from "prop-types";

function Popup(props) {
  return <MapPopup {...props}>{props?.children}</MapPopup>;
}

Popup.propTypes = {
  children: PropTypes.any,
};

export default Popup;
