import { memo } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import loadable from "@loadable/component";

// @emotion/css
import { css } from "@emotion/css";

// images
import noProduct from "../../assets/images/no-product.jpg";

// externals
const Popup = loadable(() => import("./Externals/Popup"));

function PlacePopup({ setPopupInfo, popupInfo }) {
  const { lng, lat, info } = popupInfo;
  return (
    <Popup
      className={css({
        ".mapboxgl-popup-content": {
          backgroundColor: "#191919 ",
          padding: 0,
        },
        ".mapboxgl-popup-tip": {
          borderBottomColor: "#191919 !important",
        },
        ".mapboxgl-popup-close-button": {
          color: "#ffff",
          right: "5px",
          top: "3px",
          fontSize: "22px",
        },
      })}
      anchor="top"
      longitude={Number(lng)}
      latitude={Number(lat)}
      onClose={() => setPopupInfo(null)}
      maxWidth="25vw"
    >
      <div className={css({ display: "flex", flexDirection: "column" })}>
        <div className={css({ flex: "1 0 auto", padding: "15px 30px" })}>
          <p className={css({ color: "white" })}>{info ?? ""}</p>
        </div>
      </div>
    </Popup>
  );
}

PlacePopup.propTypes = {
  setPopupInfo: PropTypes.func,
  popupInfo: PropTypes.any,
};

const PlacePopupMemo = memo(PlacePopup);

export default PlacePopupMemo;
