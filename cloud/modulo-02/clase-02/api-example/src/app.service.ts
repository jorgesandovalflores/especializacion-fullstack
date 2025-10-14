import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
    getHello(): any[] {
        return [
            {
                id: 1,
                key: "Key1",
                value: "Value1",
            },
            {
                id: 2,
                key: "Key2",
                value: "Value2",
            },
            {
                id: 3,
                key: "Key3",
                value: "Value3",
            },
            {
                id: 4,
                key: "Key4",
                value: "Value4",
            },
            {
                id: 5,
                key: "Key5",
                value: "Value5",
            },
        ];
    }
}
