export interface SignupRequest {
    email: string;
    name: string;
    password: string;
}

export interface SignupResponse {
    id: string;
    email: string;
    name: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    email: string;
}

export interface UserInfo {
    name: string;
    email: string;
}