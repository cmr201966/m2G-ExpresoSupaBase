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
  const { longitude, latitude, image, name, urlName } = popupInfo;
  return (
    <Popup
      className={css({
        ".mapboxgl-popup-content": {
          backgroundColor: "#191919 ",
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
      longitude={Number(longitude)}
      latitude={Number(latitude)}
      onClose={() => setPopupInfo(null)}
      maxWidth="25vw"
    >
      <Link to={`/watch/${urlName}`}>
        <div
          className={`flex justify-between items-center px-2 bg-dark-background2 rounded-2xl ${css(
            {
              width: "200px",
              height: "120px",
            }
          )}`}
        >
          <div className={css({ display: "flex", flexDirection: "column" })}>
            <div className={css({ flex: "1 0 auto" })}>
              <p className="font-bold text-white">{name ? name : ""}</p>
            </div>
          </div>
          <img
            className={`${css({
              width: "100px",
              height: "100px",
            })} object-cover rounded-circle`}
            src={image?.url ?? noProduct}
            alt={name}
          />
        </div>
      </Link>
    </Popup>
  );
}

PlacePopup.propTypes = {
  setPopupInfo: PropTypes.func,
  popupInfo: PropTypes.any,
};

const PlacePopupMemo = memo(PlacePopup);

export default PlacePopupMemo;
