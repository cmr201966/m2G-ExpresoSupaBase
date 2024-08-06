import { memo } from "react";
import PropTypes from "prop-types";

const Pin = memo(function Pin({ imagePlace }) {
  return (
    <img
      src={imagePlace}
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
  );
});

Pin.propTypes = {
  imagePlace: PropTypes.string,
};

export default Pin;
