import axios from "axios"
import { environment } from "../app/environment/environment"

export interface Pet {
    id: string;
    name: string;
    birthDate: string;
    description: string;
}

export async function loadPets(): Promise<Pet[]> {
    try {
        const res = (await axios.get(environment.backendUrl + "/v1/pet")).data as Pet[]
        return Promise.resolve(res)
    } catch (err) {
        return Promise.reject(err)
    }
}

export async function loadPet(id: string): Promise<Pet> {
    try {
        const res = (await axios.get(environment.backendUrl + "/v1/pet/" + id)).data as Pet
        return Promise.resolve(res)
    } catch (err) {
        return Promise.reject(err)
    }
}

export async function newPet(payload: Pet): Promise<Pet> {
    try {
        const res = (await axios.post(environment.backendUrl + "/v1/pet", payload)).data as Pet
        return Promise.resolve(res)
    } catch (err) {
        return Promise.reject(err)
    }
}

export async function savePet(payload: Pet): Promise<Pet> {
    try {
        const res = (await axios.post(environment.backendUrl + "/v1/pet/" + payload.id, payload)).data as Pet
        return Promise.resolve(res)
    } catch (err) {
        return Promise.reject(err)
    }
}

export async function deletePet(id: string): Promise<void> {
    try {
        await axios.delete(environment.backendUrl + "/v1/pet/" + id)
        return Promise.resolve()
    } catch (err) {
        return Promise.reject(err)
    }
}
