/* eslint-disable react/function-component-definition */

// @mui components
import { useTheme, Paper } from "@mui/material";

// own components
import SitoContainer from "sito-container"

// prop types
import PropTypes from "prop-types";

const CalendarCard = (props) => {
  const { children, background, onClick, day, disabled } = props;

  const theme = useTheme();

  const sendDay = () => {
    onClick(day)
  }

  return (
    <Paper
      elevation={0}
      sx={{
        padding: "10px",
        minWidth: "40px",
        minHeight: "40px",
        background: disabled ? `crimson` : "#00000000",
        border: `1px solid ${theme.palette.primary.main}`,
        borderRadius: 0,
        transition: "all 500ms ease",
        cursor: disabled ? "inherit" : "pointer",
        "&:hover": {
          background: disabled ? "crimson" : "dodgerblue"
        }
      }}
    >
      <SitoContainer extraProps={{ onClick: disabled ? undefined : sendDay }} flexDirection="column" alignItems="center">
        {children}
      </SitoContainer>
    </Paper>
  );
};
/*
CalendarCard.defaultProps = {
  background: false,
};
*/
CalendarCard.propTypes = {
  children: PropTypes.node.isRequired,
  background: PropTypes.bool,
};

export default CalendarCard;
