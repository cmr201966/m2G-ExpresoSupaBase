import { useCallback, useState } from "react";

import config from "../../config";

//Image

function useMapBox({ coordinates, flyTo, map }) {
  const [routeData, setRouteData] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);

  const getMatch = useCallback(async (coordinates, radius, profile) => {
    try {
      // Separate the radiuses with semicolons
      const radiuses = radius.join(";");
      // Create the query
      const query = await fetch(
        `https://api.mapbox.com/matching/v5/mapbox/${profile}/${coordinates}?geometries=geojson&radiuses=${radiuses}&steps=true&access_token=${config.mapBoxAPI}`,
        { method: "GET" }
      );
      const { matchings } = await query.json();
      if (matchings) {
        setRouteData({ type: "Feature", ...matchings[0].geometry });
      } else setRouteData();
    } catch (error) {
      // Handle errors
      alert(
        console.log(
          error
        )`${error.code} - ${error.message}.\n\nFor more information: https://docs.mapbox.com/api/navigation/map-matching/#map-matching-api-errors`
      );
    }
  }, []);

  const updateRoute = useCallback(
    (profileUpd = "walking") => {
      // Set the profile
      const profile = profileUpd;
      // Format the coordinates
      const newCoords = coordinates.join(";");
      // Set the radius for each coordinate pair to 25 meters
      const radius = coordinates.map(() => 50);
      getMatch(newCoords, radius, profile);
    },
    [coordinates, getMatch]
  );

  const onSelectPoint = useCallback(() => {
    if (flyTo) {
      const { longitude, latitude } = flyTo;
      map?.current?.flyTo({
        center: [longitude, latitude],
        duration: 1500,
        zoom: 17,
      });
    }
  }, [flyTo, map]);

  return {
    updateRoute,
    onSelectPoint,
    setPopupInfo,
    routeData,
    popupInfo,
  };
}

export { useMapBox };
