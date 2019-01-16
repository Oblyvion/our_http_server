interface iAppContainer {
    close(): void;
}

interface Token {
    token: string,
}

interface Playlist {
    ID: number,
    NAME: string,
}

interface UserResult {
    success: boolean,
    msg?: string,
    err?: string,
    data?: Token
}

interface PlaylistResult {
    success: boolean,
    msg?: string,
    err?: string,
    data?: Playlist
}