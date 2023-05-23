import { UserRole } from "../../src/models/users";
import { Users } from "../../src/models/users";

export const UserMock: Users= {
    id: "1",
    name: "Test1" ,
    lastname: "testLastname",
    phone: "2515122",
    email: "test@gmail.com",
    username: "test1",
    role: UserRole.DRIVER,
    password: "aa",
    createdAt: new Date(),
    extras: {"firstRun": false}
}


export const UserMock2: Users = {
    id: "2",
    name: "Test2" ,
    lastname: "testLastname",
    phone: "2515122",
    email: "test@gmail.com",
    username: "juliBertolo",
    role: UserRole.DRIVER,
    password: "bb",
    createdAt: new Date(),
    extras: {"firstRun": false}
}