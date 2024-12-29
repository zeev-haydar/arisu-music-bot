
/**
 * Split a string by whitespace, but keep quoted sections together.
 */
function specialSplit(str: string): string[] {
    const matches = str.match(/(?:[^\s"]+|"([^"]*)")+/g) || [];
    return matches.map(match => (match.startsWith('"') && match.endsWith('"') ? match.slice(1, -1) : match));
}

export { specialSplit };