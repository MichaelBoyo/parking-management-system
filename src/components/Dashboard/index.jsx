
import React, { useState } from 'react';
import style from './dashboard.module.scss';
import data from '../../canadaparkks.json';

import Map from '../Map';

function Dashboard() {
  const [navItems, setNavitem] = useState([
    { name: 'Search', active: true },
    { name: 'Personal Details', active: false },
  ]);
  const [showSearch, setShowSearch] = useState(true);
  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const activate = (n) => {
    if (n.name === 'Search') {
      setShowPersonalDetails(false);
      setShowSearch(true);
      window.location.reload();
    } else {
      setShowPersonalDetails(true);
      setShowSearch(false);
    }
    const items = navItems.map((i) => {
      if (i.name === n.name) {
        i.active = true;
      } else {
        i.active = false;
      }
      return i;
    });

    setNavitem(items);
  };
  return (
    <div className={style.App}>
      <div className={style.dashboard}>
        <div className={style.dashboard__timebar}>
          {navItems.map((n) => {
            const bc = n.active ? 'rgb(59, 178, 208)' : '';
            return (
              <h3
                style={{
                  borderColor: bc,
                }}
                key={n.name}
                onClick={() => activate(n)}
                className={style.dashboard__timebar__el}
              >
                {n.name}
              </h3>
            );
          })}
        </div>
        {showSearch && (
          <>
            <h2 className={style.dashboard__subhero}>
              Closest Parking Spot From Your Location
            </h2>
            <div id="closestPark" className={style.closestPark}>
              <a href="#" id="a-title" className={style.closestPark__a} />
              <a href="#" id="b-title" className={style.closestPark__b} />
              <a href="#" id="c-title" className={style.closestPark__c} />
            </div>
            <div className="sidebar">
              <div className="heading">
                <h1>Parking locations</h1>
              </div>
              <div id="listings" className="listings" />
            </div>
          </>
        )}
        {showPersonalDetails && (
          <div id="personalDetails" className={style.personalDetails}>
            <h1>personal details</h1>
          </div>
        )}
      </div>

      <Map />
    </div>
  );
}

const value = [{ label: 'The Shawshank Redemption', year: 1994 }];

data.features.forEach((lot) => {
  if (lot.properties.brz_name !== null) {
    const index = value.findIndex((o) => o.label === lot.properties.brz_name);
    if (index === -1) {
      value.push({ label: lot.properties.brz_name, year: 43434 });
    }
  }
});
export default Dashboard;
