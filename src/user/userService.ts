import axios, { AxiosError } from "axios"
import { environment } from "../app/environment/environment"
import { updateSessionToken, cleanupSessionToken } from "../store/tokenStore"
import { cleanupSessionUser, updateSessionUser } from "../store/userStore"

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
axios.defaults.headers.common["Content-Type"] = "application/json"

export interface Token {
  token: string
}

export async function login(params: {
  login: string
  password: string
}): Promise<Token> {
  const res = (
    await axios.post(environment.backendUrl + "/v1/user/signin", params)
  ).data as Token

  setCurrentToken(res.token)
  updateSessionToken(res.token)
  void reloadCurrentUser().then()
  return res
}

// Valores almacenados en LOCAL STORE
function getCurrentToken(): string | undefined {
  const result = localStorage.getItem("token")
  return result ? result : undefined
}

function setCurrentToken(token: string) {
  localStorage.setItem("token", token)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  axios.defaults.headers.common.Authorization = "bearer " + token
}

function getCurrentUser(): User | undefined {
  return (localStorage.getItem("user") as unknown) as User
}

export async function logout(): Promise<void> {
  localStorage.removeItem("token")
  localStorage.removeItem("user")

  try {
    await axios.get(environment.backendUrl + "/v1/user/signout")
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    axios.defaults.headers.common.Authorization = ""
    return Promise.resolve()
  } catch (err) {
    return Promise.resolve()
  } finally {
    cleanupSessionToken()
    cleanupSessionUser()
  }
}

export interface User {
  id: string
  name: string
  login: string
  permissions: string[]
}

export async function reloadCurrentUser(): Promise<User> {
  try {
    const res = (await axios.get(environment.backendUrl + "/v1/users/current"))
      .data as User
    localStorage.setItem("user", JSON.stringify(res))
    updateSessionUser(res)
    return res
  } catch (err) {
    const axiosError = err as AxiosError
    if (axiosError.response && axiosError.response.status === 401) {
      void logout()
    }
    throw err
  }
}

export async function newUser(params: {
  name: string
  password: string
  login: string
}): Promise<Token> {
  const res = (await axios.post(environment.backendUrl + "/v1/user", params))
    .data as Token
  setCurrentToken(res.token)
  updateSessionToken(res.token)
  void reloadCurrentUser().then()
  return Promise.resolve(res)
}

export async function changePassword(params: {
  currentPassword: string
  newPassword: string
}): Promise<void> {
  try {
    await axios.post(environment.backendUrl + "/v1/user/password", params)
    return
  } catch (err) {
    const axiosError = err as AxiosError

    if (axiosError.response && axiosError.response.status === 401) {
      void logout()
    }
    throw err
  }
}

if (getCurrentToken()) {
  const currentUser = getCurrentUser()
  const currentToken = getCurrentToken()
  if (currentUser !== undefined && currentToken !== undefined) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    axios.defaults.headers.common.Authorization = "bearer " + currentToken
    updateSessionToken(currentToken)
    updateSessionUser(currentUser)
    void reloadCurrentUser().then()
  }
}
