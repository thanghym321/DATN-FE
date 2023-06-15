import { Role } from "./role";

export class User {
    userId: number;
    userName: string;
    passWord: string;
    status: string;
    role: Role;
    buildingId?:number;
    name: string;
    dateOfBirth:string;
    gender:string
    avatar:string;
    address: string;
    email: string;
    ohone: string;
    citizenIdentityCard:string;
    token?: string;
}
