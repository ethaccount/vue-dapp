<script lang="ts" setup>
import { Icon, NuxtLink } from '#components'
import packageJsonCore from '../../packages/core/package.json'
import { sidebarMenu } from '~/core/sidebar'
import { NPopselect, NButton, NSwitch } from 'naive-ui'
import type { CSSProperties } from 'vue'
import { useAppStore } from '~/stores/appStore'

const headerLeftMenu = [
	{
		label: () =>
			h(
				NuxtLink,
				{
					to: '/',
				},
				{ default: () => 'Vue Dapp' },
			),
		key: '/',
		icon: () => h('img', { src: '/sheaf-of-rice/favicon-32x32.png' }),
	},
]

const { locale, locales, setLocale } = useI18n()

const localeOptions = computed(() => {
	return locales.value.map(l => ({
		label: l.label,
		value: l.code,
	}))
})

const { darkMode } = storeToRefs(useAppStore())

function toggleDarkMode() {
	darkMode.value = !darkMode.value
}
const darkModeRailStyle = ({ focused, checked }: { focused: boolean; checked: boolean }) => {
	const style: CSSProperties = {}
	if (checked) {
		// dark mode
		style.background = '#2f2f2f'
	} else {
		// light mode
		style.background = '#f1f1f1'
	}
	return style
}

const headerRightMenu = [
	{
		label: () =>
			h(
				NSwitch,
				{
					value: darkMode.value,
					'onUpdate:value': toggleDarkMode,
					size: 'medium',
					'rail-style': darkModeRailStyle,
				},
				{
					default: () =>
						h(
							NButton,
							{ size: 'small', text: true, class: 'flex justify-center items-center', focusable: false },
							{ default: () => h(Icon, { name: 'i-ion-language', class: 'w-5 h-5' }) },
						),
				},
			),
		key: 'language',
	},
	{
		label: () =>
			h(
				NPopselect,
				{
					value: locale.value,
					'onUpdate:value': setLocale,
					options: localeOptions.value,
				},
				{
					default: () =>
						h(
							NButton,
							{ size: 'small', text: true, class: 'flex justify-center items-center', focusable: false },
							{ default: () => h(Icon, { name: 'i-ion-language', class: 'w-5 h-5' }) },
						),
				},
			),
		key: 'language',
	},
	{
		label: () =>
			h(
				NuxtLink,
				{
					to: packageJsonCore.repository,
					external: true,
					target: '_blank',
				},
				{ default: () => h(Icon, { name: 'i-mdi-github', class: 'w-6 h-6' }) },
			),
		key: 'github',
	},
	{
		label: () =>
			h(
				NuxtLink,
				{
					to: 'https://github.com/vu3th/vue-dapp/releases',
					external: true,
					target: '_blank',
				},
				{ default: () => 'v' + packageJsonCore.version },
			),
		key: 'version',
	},
]

const showDrawer = ref(false)

function openDrawer() {
	showDrawer.value = true
}

function closeDrawer() {
	showDrawer.value = false
}

// prevent the menu from being selected when the route is '/'
const menuSelected = ref('')

const route = useRoute()
watch(
	() => route.path,
	() => {
		if (route.path === '/') {
			menuSelected.value = ''
		}
	},
)
// end
</script>

<template>
	<n-layout content-class="flex flex-col" position="absolute">
		<AppBanner id="gitcoin-grants" to="https://giveth.io/project/ethaccount">
			<div class="flex items-center gap-2">
				<Icon name="i-streamline-blood-donate-drop" class="w-5 h-5 flex-shrink-0 pointer-events-none" />
				<span>
					DONATIONS OPEN October 14 – October 29 |
					<span class="font-semibold italic">Gitcoin Grants 24</span> is live!
				</span>
			</div>
		</AppBanner>

		<n-layout-header bordered class="grid grid-cols-2">
			<div class="flex items-center">
				<!-- drawer button -->
				<div class="pl-5 lg:hidden flex justify-center items-center" @click="openDrawer">
					<Icon size="26" name="ic:baseline-sort" class="hover:cursor-pointer hover:text-primary-dark" />
				</div>
				<!-- logo -->
				<n-menu mode="horizontal" :options="headerLeftMenu" />
			</div>
			<!-- right side menu -->
			<div class="place-self-end">
				<n-menu id="header-right-menu" mode="horizontal" :options="headerRightMenu" />
			</div>
		</n-layout-header>

		<n-layout has-sider class="flex-1">
			<!-- sidebar -->
			<n-layout-sider
				class="hidden lg:block"
				bordered
				collapse-mode="width"
				:collapsed-width="0"
				:width="240"
				:native-scrollbar="false"
			>
				<n-menu
					v-model:value="menuSelected"
					:collapsed-width="64"
					:collapsed-icon-size="20"
					:options="sidebarMenu"
					default-expand-all
				/>
			</n-layout-sider>

			<!-- pages -->
			<n-layout>
				<slot />
			</n-layout>

			<!-- top-down drawer -->
			<n-drawer v-model:show="showDrawer" height="100%" placement="top" :trap-focus="false">
				<n-drawer-content closable>
					<template #header>
						<NuxtLink to="/" class="h-5 flex justify-center items-center gap-1" @click="closeDrawer">
							<img class="w-5" src="/sheaf-of-rice/favicon-32x32.png" alt="" />
							<p class="text-gray-500 text-sm">Vue Dapp</p>
						</NuxtLink>
					</template>
					<n-menu :options="sidebarMenu" default-expand-all @click="closeDrawer" />
				</n-drawer-content>
			</n-drawer>
		</n-layout>

		<n-layout-footer bordered> </n-layout-footer>
	</n-layout>
</template>

<style scoped>
/* dark mode switcher box-shadow remove green box-shadow */
:deep(.n-switch:focus .n-switch__rail) {
	box-shadow: 0 0 0 0.5px rgba(0, 0, 0, 0.1);
}

/* override header-right-menu padding */
:deep(#header-right-menu .n-menu-item-content) {
	padding: 10px;
}
</style>
