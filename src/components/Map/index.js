
import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import style from './map.module.scss';
import geoJson from '../../canadaparkks.json';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

function Map() {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const calgary = [-114.0917281, 51.0381918];
    geoJson.features.forEach((store, i) => {
      store.properties.id = i;
      store.geometry.type ="Point"
      if(typeof store.geometry.coordinates[0] !== "number"){
        store.geometry.coordinates = [
          store.geometry.coordinates[0][0][0],
          store.geometry.coordinates[0][0][1],
        ]
      }
    });
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: calgary,
      zoom: 10,
    });

    map.on('load', () => {
      buildLocationList(geoJson);
   
      map.loadImage(
        'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
        (error, image) => {
          if (error) throw error;
          map.addImage('custom-marker', image);
          map.addSource('places', {
            type: 'geojson',
            data: geoJson
          });

          map.addLayer({
            id: 'points',
            type: 'symbol',
            source: 'places',
            layout: {
              'icon-image': 'custom-marker',
              'text-field': ['get', 'brz_name'],
              'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
              'text-offset': [0, 1.25],
              'text-anchor': 'top',
            },
          });
        },
      );
    });


    map.addControl(
      new mapboxgl.GeolocateControl({
      positionOptions: {
      enableHighAccuracy: true
      },

      trackUserLocation: true,

      showUserHeading: true
      })
      );
    map.addControl(new mapboxgl.NavigationControl(), 'top-left');
    const { MapboxDirections } = window;

    map.addControl(
      new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: 'metric',
        profile: 'mapbox/cycling',
      }),

      'top-right',
    );
    function flyToStore(currentFeature) {
      

      map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 15,
      });
    }

    function createPopUp(currentFeature) {
      const popUps = document.getElementsByClassName('mapboxgl-popup');

      if (popUps[0]) popUps[0].remove();

      new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(currentFeature.geometry.coordinates)
        .setHTML(
          `<h3>${currentFeature.properties.address_desc}</h3><h4>${
            currentFeature.properties.brz_name === null
              ? `Street ${currentFeature.properties.id + 1}`
              : currentFeature.properties.brz_name
          }</h4>`,
        )
        .addTo(map);
    }

    map.on('click', (event) => {
      const features = map.queryRenderedFeatures(event.point, {
        layers: ['points'],
      });

      if (!features.length) return;

      const clickedPoint = features[0];
    
      flyToStore(clickedPoint);

      createPopUp(clickedPoint);

      const activeItem = document.getElementsByClassName('active');
      if (activeItem[0]) {
        activeItem[0].classList.remove('active');
      }
      const listing = document.getElementById(
        `listing-${clickedPoint.properties.id}`,
      );
      listing.classList.add('active');
    });

    function buildLocationList(stores) {
      function deg2rad(deg) {
        return deg * (Math.PI / 180);
      }
      function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const R = 6371; 
        const dLat = deg2rad(lat2 - lat1); 
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
          + Math.cos(deg2rad(lat1))
            * Math.cos(deg2rad(lat2))
            * Math.sin(dLon / 2)
            * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; 
        return d;
      }

      const locations = [];
      for (const store of geoJson.features) {
        locations.push(store.geometry.coordinates);
      }

      let closestLocation = null;
      let closestDistance = Infinity;
      const tl = JSON.parse(localStorage.getItem('myLocation'));

      const targetLocation = [tl.lon, tl.lat];

      for (let i = 0; i < locations.length; i++) {
        const distance = getDistanceFromLatLonInKm(
          targetLocation[1],
          targetLocation[0],
          locations[i][1],
          locations[i][0],
        );
        if (distance < closestDistance) {
          closestLocation = locations[i];
          closestDistance = distance;
        }
      }

      const storeList = [];
      for (const store of geoJson.features) {
        if (store.geometry.coordinates === closestLocation) {
          storeList.push(store);
        }
      }

      const store = storeList[0];
      if (store.geometry.coordinates === closestLocation) {
        const listings = document.getElementById('closestPark');

        
        const link = document.getElementById('a-title');
        if (store.properties.brz_name === null) {
          link.innerHTML = `Street ${store.properties.id + 1} ${
            store.properties.enforceable_time
          }`;
        } else {
          link.innerHTML = `${store.properties.brz_name}`
            + ` ${store.properties.enforceable_time}`;
        }
        const info = document.getElementById('b-title');
        info.innerHTML = `FEE - $${store.properties.price_zone}`;

        const info2 = document.getElementById('c-title');
        info2.innerHTML = `${store.properties.address_desc}`;

        listings.addEventListener('click', function () {
          flyToStore(store);
          createPopUp(store);

          const activeItem = document.getElementsByClassName('active');
          if (activeItem[0]) {
            activeItem[0].classList.remove('active');
          }
          this.parentNode.classList.add('active');
        });
      }

      for (const store of stores.features) {
    
        const listings = document.getElementById('listings');
        const listing = listings.appendChild(document.createElement('div'));
        listing.id = `listing-${store.properties.id}`;
        listing.className = 'item';

    
        const link = listing.appendChild(document.createElement('a'));
        link.href = '#';
        link.className = 'title';
        link.id = `link-${store.properties.id}`;
        if (store.properties.brz_name === null) {
          link.innerHTML = `Street ${store.properties.id + 1} ${
            store.properties.enforceable_time
          }`;
        } else {
          link.innerHTML = `${store.properties.brz_name}`
            + ` ${store.properties.enforceable_time}`;
        }
        const info = listing.appendChild(document.createElement('a'));
        info.className = 'title';
        info.id = `link-${store.properties.id}`;
        info.innerHTML = `FEE - $${store.properties.price_zone}`;

        link.addEventListener('click', function () {
          for (const feature of stores.features) {
            if (this.id === `link-${feature.properties.id}`) {
              flyToStore(feature);
              createPopUp(feature);
            }
          }
          const activeItem = document.getElementsByClassName('active');
          if (activeItem[0]) {
            activeItem[0].classList.remove('active');
          }
          this.parentNode.classList.add('active');
        });

 
        const details = listing.appendChild(document.createElement('div'));
        details.innerHTML = `${store.properties.address_desc}`;
        if (store.properties.phone) {
          details.innerHTML += ` · ${store.properties.phoneFormatted}`;
        }
        if (store.properties.distance) {
          const roundedDistance = Math.round(store.properties.distance * 100) / 100;
          details.innerHTML += `<div><strong>${roundedDistance} miles away</strong></div>`;
        }
      }
    }

    return () => map.remove();
  }, []);

  return <div className={style.mapcontainer} ref={mapContainerRef} />;
}

export default Map;
