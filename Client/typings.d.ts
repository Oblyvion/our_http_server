interface iAppContainer {
    close(): void;
}

interface User {
    id: number,
    name: string
}

interface UserResult {
    success: boolean,
    msg?: string,
    err?: string,
    data?: User
}