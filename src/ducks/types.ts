export interface ActionInterface {
    type: string,
    payload?: any,
    meta?: Object|string,
    error?: boolean
}
