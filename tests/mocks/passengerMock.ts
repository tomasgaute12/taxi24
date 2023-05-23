import { Passengers } from "../../src/models/passengers";
import { UserMock } from "./usesMock";

export const PassengerMock: Passengers = {
    id: '1',
    ubication: {
        lat: 13,
        long: 14
    },
    user: UserMock,
    createdAt: new Date(),
    extras: {"firstRun": false}
}