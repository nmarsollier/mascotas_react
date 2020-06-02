import axios, { AxiosError } from "axios";
import { logout } from "../store/sessionStore";
import { environment } from "../app/environment/environment";

axios.defaults.headers.common["Content-Type"] = "application/json";

export interface Pet {
    id: string;
    name: string;
    birthDate: string;
    description: string;
}

export async function loadPets(): Promise<Pet[]> {
    try {
        const res = await axios.get(environment.backendUrl + "/v1/pet");
        return Promise.resolve(res.data);
    } catch (err) {
        if ((err as AxiosError) && err.response && err.response.status === 401) {
            logout();
        }
        return Promise.reject(err);
    }
}

export async function loadPet(id: string): Promise<Pet> {
    try {
        const res = await axios.get(environment.backendUrl + "/v1/pet/" + id);
        return Promise.resolve(res.data);
    } catch (err) {
        if ((err as AxiosError) && err.response && err.response.status === 401) {
            logout();
        }
        return Promise.reject(err);
    }
}

export async function newPet(payload: Pet): Promise<Pet> {
    try {
        const res = await axios.post(environment.backendUrl + "/v1/pet", payload);
        return Promise.resolve(res.data as Pet);
    } catch (err) {
        if ((err as AxiosError) && err.response && err.response.status === 401) {
            logout();
        }
        return Promise.reject(err);
    }
}

export async function savePet(payload: Pet): Promise<Pet> {
    try {
        const res = await axios.post(environment.backendUrl + "/v1/pet/" + payload.id, payload);
        return Promise.resolve(res.data);
    } catch (err) {
        if ((err as AxiosError) && err.response && err.response.status === 401) {
            logout();
        }
        return Promise.reject(err);
    }
}

export async function deletePet(id: string): Promise<void> {
    try {
        await axios.delete(environment.backendUrl + "/v1/pet/" + id);
        return Promise.resolve();
    } catch (err) {
        if ((err as AxiosError) && err.response && err.response.status === 401) {
            logout();
        }
        return Promise.reject(err);
    }
}
