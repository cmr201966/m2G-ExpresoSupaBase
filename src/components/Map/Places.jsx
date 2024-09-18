import { memo } from "react";
import loadable from "@loadable/component";

// locals
const Place = loadable(() => import("./Place"));

function Places({ onClickPoint, noDrag, points, setPopupInfo }) {
  return points?.map((point, i) => (
    <Place
      key={`marker-${point.id}-${i}`}
      point={
        point
          ? point
          : { longitude: -79.98476050000002, latitude: 21.801503428305598 }
      }
      onClick={() => onClickPoint(i)}
      noDrag={noDrag}
      setPopupInfo={setPopupInfo}
    />
  ));
}

const PlacesMemo = memo(Places);

export default PlacesMemo;
