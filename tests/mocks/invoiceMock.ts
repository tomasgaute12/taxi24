import { Invoices } from "../../src/models/invoices";
import { PassengerMock } from "./passengerMock";
import { TripsMock } from "./tripsMock";

export const InvoicesMock: Invoices = {
    id:'1',
    passenger:PassengerMock,
    amount:13,
    trip:TripsMock,
    createdAt: new Date(),
    extras: {"firstRun": false}
}