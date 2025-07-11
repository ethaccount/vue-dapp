import { onMounted, ref } from 'vue'
import { useConnect } from './services/connect'
import { ConnectOptions, EIP1193Provider, ProviderTarget, RdnsEnum } from './types'
import { useConnectors } from './services/connectors'
import { getLastConnectedBrowserWallet } from './services/localStorage'
import { isMobileBrowser, isWindowEthereumAvailable } from './utils'
import { useEIP6963 } from './services/eip6963'

export function useAutoConnect(pinia?: any) {
	const isAutoConnecting = ref(false)
	const error = ref<Error | null>(null)

	const { connectors } = useConnectors(pinia)
	const { connectTo } = useConnect(pinia)

	onMounted(async () => {
		try {
			isAutoConnecting.value = true
			if (isMobileBrowser()) {
				await autoConnect('window.ethereum')
			} else {
				await autoConnect('rdns')
			}
		} catch (err: any) {
			error.value = err
		} finally {
			isAutoConnecting.value = false
		}
	})

	async function autoConnect(target: ProviderTarget) {
		const browserWallet = connectors.value.find(conn => conn.name === 'BrowserWallet')
		if (!browserWallet) return

		let options: ConnectOptions<'BrowserWallet'>

		switch (target) {
			case 'window.ethereum':
				if (!isWindowEthereumAvailable) return
				options = {
					target: 'window.ethereum',
				}
				break
			case 'rdns':
				const lastRdns = getLastConnectedBrowserWallet()
				if (!lastRdns) return

				/**
				 * Don't auto-connect if wallet is locked
				 * issue: https://github.com/vu3th/vue-dapp/issues/185
				 */
				const { providerDetails } = useEIP6963()
				const providerDetail = providerDetails.value.find(p => p.info.rdns === lastRdns)
				if (providerDetail) {
					const provider = providerDetail.provider
					const unlocked = await isUnlocked(provider)
					if (!unlocked) {
						return
					}
				}

				options = { target: 'rdns', rdns: lastRdns }
				break
			default:
				const err = new Error('target is required')
				error.value = err
				throw err
		}

		try {
			await connectTo('BrowserWallet', options)
		} catch (err: any) {
			error.value = err
			throw err
		}
	}

	return { isAutoConnecting, error }
}

export async function isUnlocked(provider: EIP1193Provider) {
	let unlocked

	try {
		const accounts = await provider.request({ method: 'eth_accounts' })
		unlocked = accounts.length > 0
	} catch (e) {
		unlocked = false
	}
	return unlocked
}
