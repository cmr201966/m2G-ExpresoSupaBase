import PropTypes from "prop-types";

import "./styles.css";

const Grid = (props) => {
  const { children } = props;

{/*  return <div className="gridCentral gapDelMedio width">{children}</div>;*/}
  return <div className="gridCentral gapDelMedio ">{children}</div>;
};

Grid.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Grid;
