export const formatName = (name: string) => {
    const formattedName = name
    .trim()
    .split(" ")
    .map(
        m=> m.charAt(0).toUpperCase() + m.slice(1).toLowerCase()
    )
    .join(" ")

    return formattedName
}

export const formatDate = (date: Date) => {
    const formattedDate = new Date(date)
    .toLocaleDateString("en-us",{
        day: "2-digit",
        month: "short",
        year: "numeric"
    })

    return formattedDate
}