export type ConnectionLimitsType = {
    ip: string,
    action: string,
    connectionAt: Date
}

export type BlockedConnectionType = {
    ip: string,
    action: string,
    bannedAt: Date
}