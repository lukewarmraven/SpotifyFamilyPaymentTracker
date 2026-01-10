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

export function formatOrdinal(n: number){
    const mod100 = n % 100;

    if (mod100 >= 11 && mod100 <= 13) {
        return `${n}th`;
    }

    switch (n % 10) {
        case 1:
        return `${n}st`;
        case 2:
        return `${n}nd`;
        case 3:
        return `${n}rd`;
        default:
        return `${n}th`;
    }
}