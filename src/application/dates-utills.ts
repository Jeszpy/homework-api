type TimeIntervalType = Partial<{
    weeks: number
    days: number
    hours: number
    minutes: number
    seconds: number
}>


export const mixTimeInterval = ({weeks = 0, days = 0, hours = 0, minutes = 0, seconds = 0}: TimeIntervalType) => {
    const oneSecond = 1000
    const oneMinute = oneSecond * 60
    const oneHour = oneMinute * 60
    const oneDay = oneHour * 24
    const oneWeek = oneDay * 7
    seconds = seconds * oneSecond
    minutes = minutes * oneMinute
    hours = hours * oneHour
    days = days * oneDay
    weeks = weeks * oneWeek
    return weeks + days + hours + minutes + seconds
}
