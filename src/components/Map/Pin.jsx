import { memo } from "react";
import PropTypes from "prop-types";

const Pin = memo(function Pin({ imagePlace, imageClassName }) {
  return (
    <>
    <img
      src={imagePlace}
      className={imageClassName}
      loading="lazy"
      style={{
        width: "35px",
        height: "35px",
        objectFit: "contain",
        backgroundPosition: "center",
        backgroundSize: "cover",
        borderRadius: "50%",
      }}
    />
    </>
  );
});

Pin.propTypes = {
  imagePlace: PropTypes.string,
  imageClassName: PropTypes.string
};

export default Pin;
