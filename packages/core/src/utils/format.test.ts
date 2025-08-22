import { normalizeChainId } from './format'

describe('normalizeChainId', () => {
	it('should normalize chainId', () => {
		expect(normalizeChainId('0xaa36a7')).toBe(11155111)
		expect(normalizeChainId(111155111)).toBe(111155111)
		expect(normalizeChainId(BigInt(111155111))).toBe(111155111)
		expect(normalizeChainId('11155111')).toBe(11155111)
	})
})
