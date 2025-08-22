import { computed } from 'vue'
import { EIP6963AnnounceProviderEvent, EIP6963ProviderDetail, RDNS } from '../types'
import { useStore } from '../store'

export function useEIP6963(pinia?: any) {
	const store = useStore(pinia)

	let listener: (event: EIP6963AnnounceProviderEvent) => void = () => {}

	function subscribe() {
		const listener = (event: EIP6963AnnounceProviderEvent) => {
			// console.log('eip6963:announceProvider -> detail', event.detail)
			_addProviderDetail(event.detail)
		}

		window.addEventListener('eip6963:announceProvider', listener)

		window.dispatchEvent(new CustomEvent('eip6963:requestProvider'))

		return () => window.removeEventListener('eip6963:announceProvider', listener)
	}

	function removeListener() {
		if (!listener) return
		window.removeEventListener('eip6963:announceProvider', listener)
	}

	function _addProviderDetail(detail: EIP6963ProviderDetail) {
		if (store.providerDetails.some(({ info }) => info.uuid === detail.info.uuid)) return
		store.providerDetails.push(detail) // why detail cannot be markRaw()? it will lead to "TypeError: Cannot define property __v_skip, object is not extensible"
	}

	function getProviderDetail(rdns: string | RDNS): EIP6963ProviderDetail | undefined {
		return store.providerDetails.find(({ info }) => info.rdns === rdns)
	}

	return {
		// state
		providerDetails: computed(() => store.providerDetails),

		// getters
		hasInjectedProvider: computed(() => typeof window !== 'undefined' && !!window.ethereum),
		isProviderAnnounced: computed(() => store.providerDetails.length > 0),

		subscribe,
		getProviderDetail,
		removeListener,
	}
}
