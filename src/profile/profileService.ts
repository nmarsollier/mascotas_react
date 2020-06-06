import axios, { AxiosError } from "axios"
import { environment } from "../app/environment/environment"
import { logout } from "../user/userService"

interface Profile {
    name: string;
    phone: string;
    email: string;
    address: string;
    province: string;
    picture: string;
}

interface UpdateBasicProfile {
    name: string;
    phone: string;
    email: string;
    address: string;
    province: string;
}

export async function updateBasicInfo(data: UpdateBasicProfile): Promise<Profile> {
    try {
        const res = (await axios.post(environment.backendUrl + "/v1/profile", data)).data as Profile
        return Promise.resolve(res)
    } catch (err) {
        if ((err as AxiosError).code === "401") {
            void logout()
        }
        return Promise.reject(err)
    }
}

interface UpdateProfileImage {
    image: string;
}
interface UpdateProfileImageId {
    id: string;
}

export async function updateProfilePicture(payload: UpdateProfileImage): Promise<UpdateProfileImageId> {
    try {
        const res = (await axios.post(environment.backendUrl + "/v1/profile/picture", payload)).data as UpdateProfileImageId
        return Promise.resolve(res)
    } catch (err) {
        return Promise.reject(err)
    }
}

export async function getCurrentProfile(): Promise<Profile> {
    try {
        const res = (await axios.get(environment.backendUrl + "/v1/profile")).data as Profile
        return Promise.resolve(res)
    } catch (err) {
        const axiosError = err as AxiosError
        if (axiosError.response && axiosError.response.status === 401) {
            void logout()
        }
        return Promise.reject(err)
    }
}

export function getPictureUrl(id: string) {
    if (id && id.length > 0) {
        return environment.backendUrl + "/v1/image/" + id
    } else {
        return "/assets/profile.png"
    }
}
