import axios from "axios"
import { environment } from "../app/environment/environment"

export interface Province {
  id: string
  name: string
}

export async function getProvinces(): Promise<Province[]> {
  return (await axios.get(environment.backendUrl + "/v1/province"))
    .data as Province[]
}
