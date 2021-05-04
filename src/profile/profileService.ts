import axios, { AxiosError } from "axios"
import { environment } from "../app/environment/environment"
import { logout } from "../user/userService"

interface Profile {
  name: string
  phone: string
  email: string
  address: string
  province: string
  picture: string
}

export async function updateBasicInfo(params: {
  name: string
  phone: string
  email: string
  address: string
  province: string
}): Promise<Profile> {
  try {
    const res = (
      await axios.post(environment.backendUrl + "/v1/profile", params)
    ).data as Profile
    return Promise.resolve(res)
  } catch (err) {
    if ((err as AxiosError).code === "401") {
      void logout()
    }
    return Promise.reject(err)
  }
}

interface UpdateProfileImageId {
  id: string
}

export async function updateProfilePicture(params: {
  image: string
}): Promise<UpdateProfileImageId> {
  return (
    await axios.post(environment.backendUrl + "/v1/profile/picture", params)
  ).data as UpdateProfileImageId
}

export async function getCurrentProfile(): Promise<Profile> {
  try {
    return (await axios.get(environment.backendUrl + "/v1/profile"))
      .data as Profile
  } catch (err) {
    const axiosError = err as AxiosError
    if (axiosError.response && axiosError.response.status === 401) {
      void logout()
    }
    throw err
  }
}

export function getPictureUrl(id: string) {
  if (id && id.length > 0) {
    return environment.backendUrl + "/v1/image/" + id
  } else {
    return "/assets/profile.png"
  }
}
