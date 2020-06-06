import { useState } from "react"
import { RouteComponentProps } from 'react-router-dom'

export function goHome(props: RouteComponentProps) {
    props.history.push("/")
}

export function useForceUpdate() {
    const setForceUpdate = useState(0)[1]

    return () => {
        setForceUpdate(Date.now)
    }
}
