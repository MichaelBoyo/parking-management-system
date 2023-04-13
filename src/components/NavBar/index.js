import React from "react";
import style from "./index.module.scss";

const index = () => {
  return (
    <div className={style.navbar}>
     <p className={style.navbar__icon}>PARK</p>
     <p className={style.navbar__ico}>EASY</p>
    </div>
  );
};

export default index;
