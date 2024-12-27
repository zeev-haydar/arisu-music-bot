
/**
 * Split a string by whitespace, but keep quoted sections together.
 */
function specialSplit(str: string): string[] {
    return str.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
}

export { specialSplit };