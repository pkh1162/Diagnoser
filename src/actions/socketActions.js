export const INIT_SOCKET = "INIT_SOCKET";

export const initSocket = (data) => {
    return {
        type: INIT_SOCKET,
        data
    }
}