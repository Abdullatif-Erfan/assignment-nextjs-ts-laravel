import React from "react";
import { NextPage } from "next";
import style from "../../styles/spinner.module.css";
const Spinner: NextPage<{}> = () => {
  return (
    <div className={style.spinner}>
      <div className={style.rect1} />
      <div className={style.rect2} />
      <div className={style.rect3} />
      <div className={style.rect4} />
      <div className={style.rect5} />
    </div>
  );
}

export default Spinner;
