import React, { useContext } from "react";
import locations from "../../canadaparkks.json";

import Map from "../Map";

import { useGeolocated } from "react-geolocated";

function Dashboard() {
  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });
  const [trackingNumber, setTrackingNumber] = React.useState("");
  const handleSearch = () => {
    console.log("searching for", trackingNumber);
    const item = locations.features.find(
      (location) => location.properties.tracking_id === trackingNumber
    );
    console.log("found item", item);
    if (!item) return alert("No item found");
    const el = document.getElementById(`link-${item.properties.tracking_id}`);
    console.log("el", el);
    // trigger click
    el.click();
  };
  return (
    <div className="flex justify-between w-screen h-full ">
      <div className="w-1/5 p-3">
        <input
          className="input input-bordered w-full max-w-xs"
          onChange={(e) => setTrackingNumber(e.target.value)}
          value={trackingNumber}
          placeholder="Search tracking number"
        />
        <button onClick={handleSearch} className="btn">
          Search
        </button>
        <p>{coords?.latitude}</p>
        <p>{coords?.longitude}</p>

        <div id="listings"></div>
      </div>

      <Map />
    </div>
  );
}

export default Dashboard;
