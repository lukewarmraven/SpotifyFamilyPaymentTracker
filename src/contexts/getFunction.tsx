export function getMonthDiff(start: Date, end: Date) {
    const startYear = start.getFullYear()
    const startMonth = start.getMonth()
    const endYear = end.getFullYear()
    const endMonth = end.getMonth()

    return ((endYear - startYear) * 12 + (endMonth - startMonth)) + 1
}