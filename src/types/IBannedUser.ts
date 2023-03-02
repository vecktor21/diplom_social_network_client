export interface IBannedUser {
    blockedUserId: number,
    blockedUserName: string,
    blockedUserImage: string,
    reason: string,
    dateFrom: Date,
    dateTo: Date
}
