import type { ModelUser } from "../models/ModelUser";

export default class MapperUser {

    public static toEmpty(): ModelUser {
        return {
            id: '',
            name: '',
            email: '',
            password: ''
        }
    }

}