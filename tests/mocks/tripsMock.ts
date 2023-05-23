import { Trips, TripsState } from "../../src/models/trips"
import { DriverMock } from "./driversMock"
import { PassengerMock } from "./passengerMock"

export const TripsMock: Trips = {
    id: '1',
    driver:DriverMock,
    passenger: PassengerMock,
    startLocation: {
        lat: 20,
        long: 30
    },
    endLocation: {
        lat: 40,
        long: 50
    },
    startTime: 12,
    endTime: 13,
    state: TripsState.INITIATED,
    price: 13,
    createdAt: new Date(),
    extras: {"firstRun": false}
}