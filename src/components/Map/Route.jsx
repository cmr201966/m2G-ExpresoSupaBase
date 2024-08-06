import { memo } from "react";
import { Fragment } from "react";
import PropTypes from "prop-types";
import loadable from "@loadable/component";

// externals
const Layer = loadable(() => import("./Externals/Layer"));
const Source = loadable(() => import("./Externals/Source"));

function Route({ routeData }) {
  return (
    <Fragment>
      <Source id="route" type="geojson" data={routeData} />
      <Layer
        id="route"
        type="line"
        source="route"
        layout={{
          "line-join": "round",
          "line-cap": "round",
        }}
        paint={{
          "line-color": "#ffa726",
          "line-width": 2,
          "line-dasharray": [0.1, 1.5],
        }}
      />
    </Fragment>
  );
}

const RouteMemo = memo(Route);

Route.propTypes = {
  routeData: PropTypes.any,
};

export default RouteMemo;
