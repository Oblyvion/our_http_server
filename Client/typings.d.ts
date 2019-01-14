interface iAppContainer {
    close(): void;
}

interface User {
    NAME: string,
    PASSWORD: string
}

interface Playlist {
    ID: number,
    NAME: string,
}

interface UserResult {
    success: boolean,
    msg?: string,
    err?: string,
    data?: User
}

interface PlaylistResult {
    success: boolean,
    msg?: string,
    err?: string,
    data?: Playlist
}