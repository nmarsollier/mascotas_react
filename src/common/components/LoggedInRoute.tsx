import React from "react";
import { useSelector } from "react-redux";
import { Route, RouteProps } from "react-router-dom";
import { StoredState } from "../../store/sessionStore";
import Welcome from "../../welcome/Welcome";


export default function StateLoggedInRoute(props: RouteProps) {
  const token = useSelector((state: StoredState) => state.token)

  if (token === undefined) {
    return (<Route exact path={props.path} component={Welcome} />);
  } else {
    return (<Route exact path={props.path} component={props.component} />);
  }
}
