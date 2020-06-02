import axios, { AxiosError } from "axios";
import { logout as sessionLogout } from "../store/sessionStore";
import { environment } from "../app/environment/environment";

axios.defaults.headers.common["Content-Type"] = "application/json";

export function getCurrentToken(): string | undefined {
    const result = localStorage.getItem("token");
    return result ? result : undefined;
}

function setCurrentToken(token: string) {
    localStorage.setItem("token", token);
    axios.defaults.headers.common.Authorization = "bearer " + token;
}

export function getCurrentUser(): User | undefined {
    return (localStorage.getItem("user") as unknown) as User;
}

export async function logout(): Promise<void> {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    try {
        await axios.get(environment.backendUrl + "/v1/user/signout");
        axios.defaults.headers.common.Authorization = "";
        return Promise.resolve();
    } catch (err) {
        return Promise.resolve();
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
        const res = await axios.post(environment.backendUrl + "/v1/user/signin", payload);
        setCurrentToken(res.data.token);
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
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
        const res = await axios.get(environment.backendUrl + "/v1/users/current");
        localStorage.setItem("user", res.data);
        return Promise.resolve(res.data);
    } catch (err) {
        if ((err as AxiosError) && err.response && err.response.status === 401) {
            sessionLogout();
        }
        return Promise.reject(err);
    }
}

export interface SignUpRequest {
    name: string;
    password: string;
    login: string;
}

export async function newUser(payload: SignUpRequest): Promise<IToken> {
    try {
        const res = await axios.post(environment.backendUrl + "/v1/user", payload);
        setCurrentToken(res.data.token);
        return Promise.resolve(res.data);
    } catch (err) {
        return Promise.reject(err);
    }
}

export interface IChangePassword {
    currentPassword: string;
    newPassword: string;
}

export async function changePassword(payload: IChangePassword): Promise<void> {
    try {
        const res = await axios.post(environment.backendUrl + "/v1/user/password", payload);
        return Promise.resolve(res.data);
    } catch (err) {
        if ((err as AxiosError) && err.response && err.response.status === 401) {
            sessionLogout();
        }
        return Promise.reject(err);
    }
}

if (getCurrentToken()) {
    axios.defaults.headers.common.Authorization = "bearer " + getCurrentToken();
}
