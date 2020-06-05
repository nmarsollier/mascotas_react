import React from "react";
import { useUserState } from "../store/rxJsStore";
import LoginMenu from "./LoginMenu";
import MainMenu from "./MainMenu";
import "./Menu.css";

export default function Menu() {
  const user = useUserState()

  const menu = user ? <MainMenu /> : <LoginMenu />;

  return (
    <div className="menu_div navbar-nav bg-light shadow">
      {menu}
    </div>
  );
}
