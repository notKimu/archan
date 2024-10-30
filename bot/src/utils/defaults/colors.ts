export const colors = {
    "danger": 0xff4a3d,
    "warning": 0xff7e3d,
    "ok": 0xcbff3d,
}

export function invertHex(hexString: string): string {
    const hex = hexString.replace("#", "")
    return "#" + (Number(`0x1${hex}`) ^ 0xFFFFFF).toString(16).substring(1).toUpperCase();
}