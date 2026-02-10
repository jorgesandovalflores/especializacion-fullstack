import type { ModelUser } from "../models/ModelUser"

export type UserSigninResponse = {
    token: string
    user: ModelUser
}