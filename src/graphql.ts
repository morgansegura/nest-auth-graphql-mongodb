
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum RoleEnum {
    MEMBER = "MEMBER",
    MANAGER = "MANAGER",
    ADMIN = "ADMIN"
}

export class CreateUserInput {
    username: string;
    password: string;
    email: string;
}

export class UpdateUserInput {
    username?: Nullable<string>;
    password?: Nullable<string>;
    email?: Nullable<string>;
}

export class LoginUserInput {
    email: string;
    password: string;
}

export class LoginResponse {
    token: string;
}

export class User {
    _id: string;
    id: string;
    username: string;
    password: string;
    email: string;
    role: RoleEnum;
    status: boolean;
    isEmailConfirmed: boolean;
    createdAt: string;
    updatedAt: string;
}

export abstract class IQuery {
    abstract hello(): string | Promise<string>;

    abstract me(): Nullable<User> | Promise<Nullable<User>>;

    abstract users(offset: number, limit: number): Nullable<User[]> | Promise<Nullable<User[]>>;

    abstract user(id: string): Nullable<User> | Promise<Nullable<User>>;
}

export abstract class IMutation {
    abstract register(input: CreateUserInput): Nullable<User> | Promise<Nullable<User>>;

    abstract updateUser(id: string, input: UpdateUserInput): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract deleteUser(id: string): Nullable<boolean> | Promise<Nullable<boolean>>;

    abstract deleteUsers(): boolean | Promise<boolean>;

    abstract login(input: LoginUserInput): Nullable<LoginResponse> | Promise<Nullable<LoginResponse>>;

    abstract setRole(id: string, role: RoleEnum): Nullable<boolean> | Promise<Nullable<boolean>>;
}

export abstract class ISubscription {
    abstract userCreated(): Nullable<User> | Promise<Nullable<User>>;
}

type Nullable<T> = T | null;
