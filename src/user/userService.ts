import axios, { AxiosError } from "axios"
import { environment } from "../app/environment/environment"
import { updateSessionToken, cleanupSessionToken } from "../store/tokenStore"
import { cleanupSessionUser, updateSessionUser } from "../store/userStore"

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
axios.defaults.headers.common["Content-Type"] = "application/json"

export function getCurrentToken(): string | undefined {
    const result = localStorage.getItem("token")
    return result ? result : undefined
}

function setCurrentToken(token: string) {
    localStorage.setItem("token", token)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    axios.defaults.headers.common.Authorization = "bearer " + token
}

export function getCurrentUser(): User | undefined {
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

export interface Login {
    login: string;
    password: string;
}

export interface IToken {
    token: string;
}

export async function login(payload: Login): Promise<IToken> {
    try {
        const res: IToken = (await axios.post(environment.backendUrl + "/v1/user/signin", payload)).data as IToken
        setCurrentToken(res.token)
        updateSessionToken(res.token)
        void reloadCurrentUser().then()
        return Promise.resolve(res)
    } catch (err) {
        return Promise.reject(err)
    }
}

export interface User {
    id: string;
    name: string;
    login: string;
    permissions: string[];
}

export async function reloadCurrentUser(): Promise<User> {
    try {
        const res = (await axios.get(environment.backendUrl + "/v1/users/current")).data as User
        localStorage.setItem("user", JSON.stringify(res))
        updateSessionUser(res)
        return Promise.resolve(res)
    } catch (err) {
        const axiosError = err as AxiosError
        if (axiosError.response && axiosError.response.status === 401) {
            void logout()
        }
        return Promise.reject(err)
    }
}

export interface SignUpRequest {
    name: string;
    password: string;
    login: string;
}

export async function newUser(payload: SignUpRequest): Promise<IToken> {
    try {
        const res = (await axios.post(environment.backendUrl + "/v1/user", payload)).data as IToken
        setCurrentToken(res.token)
        updateSessionToken(res.token)
        void reloadCurrentUser().then()
        return Promise.resolve(res)
    } catch (err) {
        return Promise.reject(err)
    }
}

export interface IChangePassword {
    currentPassword: string;
    newPassword: string;
}

export async function changePassword(payload: IChangePassword): Promise<void> {
    try {
        await axios.post(environment.backendUrl + "/v1/user/password", payload)
        return Promise.resolve()
    } catch (err) {
        const axiosError = err as AxiosError

        if (axiosError.response && axiosError.response.status === 401) {
            void logout()
        }
        return Promise.reject(err)
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
