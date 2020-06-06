import React from "react"
import { Route, RouteProps } from "react-router-dom"
import Welcome from "../../welcome/Welcome"
import { useSessionToken } from "../../store/tokenStore"

export default function StateLoggedInRoute(props: RouteProps) {
  const token = useSessionToken()

  if (token === undefined) {
    return (<Route exact path={props.path} component={Welcome} />)
  } else {
    return (<Route exact path={props.path} component={props.component} />)
  }
}
