/**
 * Convert a number to a hexadecimal value
 */
export function toHex(n: number): string {
	const hexValue = n.toString(16)
	return '0x' + hexValue
}

export function shortenAddress(address: string, startLength = 6, endLength = 4): string {
	if (typeof address !== 'string' || !address) return ''
	return address.slice(0, startLength) + '...' + address.slice(-endLength)
}

/**
 * Convert a chainId to a decimal number, support hex, decimal string and bigint
 */
export function normalizeChainId(chainId: string | number | bigint): number {
	if (typeof chainId === 'string') return Number.parseInt(chainId, chainId.trim().substring(0, 2) === '0x' ? 16 : 10)
	if (typeof chainId === 'bigint') return Number(chainId)
	return chainId
}
