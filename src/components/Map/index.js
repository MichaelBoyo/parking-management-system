import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import style from "./map.module.scss";
import geoJson from "../../canadaparkks.json";
import { useGeolocated } from "react-geolocated";
mapboxgl.accessToken =
  "pk.eyJ1IjoiYm95b3lvIiwiYSI6ImNsbzBmcTcwbzFhMGUybHFvbXQzM2xoNnUifQ.pPZYm_Yolaa-b14s58Yf6Q";

function Map() {
  const mapContainerRef = useRef(null);
  const { coords, isGeolocationAvailable, isGeolocationEnabled } =
    useGeolocated({
      positionOptions: {
        enableHighAccuracy: false,
      },
      userDecisionTimeout: 5000,
    });

  useEffect(() => {
    const calgary = [coords?.latitude || 0, coords?.longitude || 0];
    geoJson.features.forEach(async (store, i) => {
      i = i + 1;
      store.properties.id = i;
      store.geometry.type = "Point";
      if (typeof store.geometry.coordinates[0] !== "number") {
        store.geometry.coordinates = [
          store.geometry.coordinates[0][0][0],
          store.geometry.coordinates[0][0][1],
        ];
      }
      if (
        store.properties.price_zone === null ||
        isNaN(store.properties.price_zone)
      ) {
        store.properties.price_zone = "10";
      }
      if (store.properties.brz_name === null) {
        store.properties.brz_name = "Street";
      }
      if (!store.properties.brz_name.includes("-")) {
        store.properties.brz_name +=
          "-" +
          store.properties.parking_zone +
          "-" +
          store.properties.block_side;
      }

      // registerLots({
      //   name: store.properties.brz_name,
      //   price: Number(store.properties.price_zone),
      // });
    });
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: calgary,
      zoom: 10,
    });

    map.on("load", () => {
      buildLocationList(geoJson);

      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        (error, image) => {
          if (error) throw error;
          map.addImage("custom-marker", image);
          map.addSource("places", {
            type: "geojson",
            data: geoJson,
          });

          map.addLayer({
            id: "points",
            type: "symbol",
            source: "places",
            layout: {
              "icon-image": "custom-marker",
              "text-field": ["get", "brz_name"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });
        }
      );
    });

    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },

        trackUserLocation: true,

        showUserHeading: true,
      })
    );
    map.addControl(new mapboxgl.NavigationControl(), "top-left");
    const { MapboxDirections } = window;

    map.addControl(
      new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: "metric",
        profile: "mapbox/cycling",
      }),

      "top-right"
    );
    function flyToStore(currentFeature) {
      map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 15,
      });
    }

    function createPopUp(currentFeature) {
      const popUps = document.getElementsByClassName("mapboxgl-popup");

      if (popUps[0]) popUps[0].remove();

      new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML(
          `<h3>${currentFeature.properties.address_desc}</h3><h4>${
            currentFeature.properties.brz_name === null
              ? `Street ${currentFeature.properties.id + 1}`
              : currentFeature.properties.brz_name
          }</h4>`
        )
        .addTo(map);
    }

    map.on("click", (event) => {
      const features = map.queryRenderedFeatures(event.point, {
        layers: ["points"],
      });

      if (!features.length) return;

      const clickedPoint = features[0];

      flyToStore(clickedPoint);

      createPopUp(clickedPoint);

      const activeItem = document.getElementsByClassName("active");
      if (activeItem[0]) {
        activeItem[0].classList.remove("active");
      }
      const listing = document.getElementById(
        `listing-${clickedPoint.properties.id}`
      );
      listing.classList.add("active");
    });

    async function buildLocationList(stores) {
      for (const store of stores.features) {
        const listings = document.getElementById("listings");

        const link = listings.appendChild(document.createElement("a"));
        link.href = "#";
        link.className = "hidden";
        link.id = `link-${store.properties.tracking_id}`;

        link.innerHTML = `${store.properties.brz_name}`;

        link.addEventListener("click", function () {
          for (const feature of stores.features) {
            if (this.id === `link-${feature.properties.tracking_id}`) {
              flyToStore(feature);
              createPopUp(feature);
            }
          }
          const activeItem = document.getElementsByClassName("active");
          if (activeItem[0]) {
            activeItem[0].classList.remove("active");
          }
          this.parentNode.classList.add("active");
        });
      }
    }

    return () => map.remove();
  }, [coords]);

  return <div className={style.mapcontainer} ref={mapContainerRef}></div>;
}

export default Map;
