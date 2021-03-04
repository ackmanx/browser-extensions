import { browser } from 'webextension-polyfill-ts'
import { Metadata, defaultMetadata } from './metadata'
import { defaultUserOptions, UserOptions } from './options'
import { Favorite } from '../react-app-env'

browser.storage.local.get().then((contents) => console.log(777, 'Storage contents:', contents))

export async function getBookmarksHash(): Promise<string> {
    return (await browser.storage.local.get({ bookmarksHash: '' })).bookmarksHash
}

export async function saveBookmarksHash(bookmarksHash: string) {
    await browser.storage.local.set({ bookmarksHash })
}

export async function getMetadata(): Promise<Metadata> {
    return (await browser.storage.local.get({ metadata: defaultMetadata })).metadata
}

export async function saveMetadata(metadata: Metadata) {
    await browser.storage.local.set({ metadata })
}

export async function getUserOptions(): Promise<UserOptions> {
    return (await browser.storage.local.get({ userOptions: defaultUserOptions })).userOptions
}

export async function saveUserOptions(userOptions: UserOptions) {
    await browser.storage.local.set({ userOptions })
}

export async function getFavorites(): Promise<Favorite[]> {
    return (await browser.storage.local.get({ favorites: [] })).favorites
}

export async function saveFavorites(favorites: Favorite[]) {
    await browser.storage.local.set({ favorites })
}
