import {
	Connector,
	ConnectorName,
	OnAccountsChangedCallback,
	OnChainChangedCallback,
	OnDisconnectCallback,
	Wallet,
} from '../types'
import { computed, markRaw } from 'vue'

export function useConnectors(walletStore: {
	wallet: Wallet
	connectors: Connector[]
	onDisconnectCallback: OnDisconnectCallback | null
	onAccountsChangedCallback: OnAccountsChangedCallback | null
	onChainChangedCallback: OnChainChangedCallback | null
}) {
	function hasConnector(connectorName: ConnectorName | string) {
		return walletStore.connectors.some((conn: Connector) => conn.name === connectorName)
	}

	function addConnector(connector: Connector) {
		if (walletStore.connectors.find((conn: Connector) => conn.name === connector.name)) {
			throw new Error(`Connector ${connector.name} already added`)
		}

		// notice: connector instance cannot be a proxy, it might lead to "TypeError: Cannot access private method"
		walletStore.connectors.push(markRaw(connector))
	}

	function addConnectors(connectors: Connector[]) {
		connectors.forEach(conn => addConnector(conn))
	}

	return {
		connectors: computed(() => walletStore.connectors),
		addConnector,
		addConnectors,
		hasConnector,
	}
}
