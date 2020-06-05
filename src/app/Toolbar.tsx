import React from "react";
import "./Toolbar.css";
import { environment } from "./environment/environment";
import { useUserState } from "../store/rxJsStore";

export default function Toolbar() {
  const user = useUserState()

  return (
    <nav className="navbar navbar-expand-sm bg-dark navbar-dark d-flex shadow">
      <div className="toolbar_icon">
        <img src="/assets/favicon.png" alt=""></img>
      </div>

      <div className="toolbar_title navbar-brand flex-grow-1">
        Mascotas {user ? " - " + user.name : ""}
      </div>

      <div className="btn-group navbar-nav">
        <a href={environment.backendUrl + "/"} target="apidoc"
          className="toolbar_button btn btn-outline-secondary btn-sm nav-link">
          ApiDoc
          </a>
      </div>
    </nav>
  );
}
