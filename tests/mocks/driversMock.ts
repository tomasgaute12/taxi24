import { Drivers } from "../../src/models/drivers";
import { UserMock } from "./usesMock";

export const DriverMock: Drivers = {
    id: "55f0eaa1-1cf7-4d2f-9a2b-9d0e1f26527f",
    licenseNumber:"21",
    user: UserMock,
    carModel: "Peugeot",
    carPlateNumber: "AA12",
    isActive: true,
    ubication: {
        lat: 12,
        long: 11
    },
    createdAt: new Date(),
    extras: {"firstRun": false}
}

export const DriverMock2: Drivers = {
    id: "2",
    licenseNumber:"22",
    user: UserMock,
    carModel: "Onix",
    carPlateNumber: "AA14",
    isActive: true,
    ubication: {
        lat: 14,
        long: 112
    },
    createdAt: new Date(),
    extras: {"firstRun": false}
}