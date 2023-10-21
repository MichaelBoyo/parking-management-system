import style from "./index.module.scss";

const NavBar = () => {
  return (
    <div className={style.navbar}>
      <div className={style.navbar__logo}>
        <p className={style.navbar__logo__icon}>Parcel</p>
        <p className={style.navbar__logo__ico}>Tracking</p>
      </div>
    </div>
  );
};

export default NavBar;
