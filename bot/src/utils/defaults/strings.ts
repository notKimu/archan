export function trimmer(value: string) {
    if (value.length > 3 && value.length < 7) {
        return value.slice(0, 1) + "K"
    } else if (value.length > 6 && value.length < 13) {
        return value.slice(0, 1) + "M"
    }
    return value;
}