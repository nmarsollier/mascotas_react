import axios from "axios"
import { environment } from "../app/environment/environment"
import Swal from 'sweetalert2'

export interface LostPet {
    id: string;
    name: string;
    missingDate: string;
    description: string;
    phoneContact: string;
    reward: string;
}

export async function loadLostPets(): Promise<LostPet[]> {
    try {
        const res = (await axios.get(environment.backendUrl + "/v1/lostpet")).data as LostPet[]
        return Promise.resolve(res)
    } catch (err) {
        return Promise.reject(err)
    }
}


export async function newLostPet(payload: LostPet): Promise<LostPet> {
    try {
        console.log(payload)
        const res = (await axios.post(environment.backendUrl + "/v1/lostpet", payload)).data as LostPet
        return Promise.resolve(res)
    } catch (err) {
        return Promise.reject(err)
    }
}

export async function findPet(id: string): Promise<void> {
    Swal.fire({
        title: "Gracias por encontrar a esta mascota",
        text: "Porfavor confirma esta acción",
        type: 'success',
        showCancelButton: true
    }).then (async (result) => {
        try {
            await axios.delete(environment.backendUrl + "/v1/lostpet/" + id)
            return Promise.resolve()
        } catch (err) {
            return Promise.reject(err)
        } 
    })
}


