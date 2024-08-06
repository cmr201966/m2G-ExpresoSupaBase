import PropTypes from "prop-types";

import "./styles.css";

const Grid = (props) => {
  const { children } = props;

  return <div className="grid gap width">{children}</div>;
};

Grid.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Grid;
