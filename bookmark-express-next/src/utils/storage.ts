import { browser } from 'webextension-polyfill-ts'
import { Metadata, defaultMetadata } from './metadata'
import { defaultUserOptions, UserOptions } from './options'

browser.storage.local.get().then((contents) => console.log(777, 'Storage contents:', contents))

export async function getBookmarksHash(): Promise<string> {
    return (await browser.storage.local.get({ bookmarksHash: '' })).bookmarksHash
}

export async function saveBookmarksHash(bookmarksHash: string) {
    await browser.storage.local.set({ bookmarksHash })
}

export async function getCache(): Promise<Metadata> {
    return (await browser.storage.local.get({ cache: defaultMetadata })).cache
}

export async function saveCache(cache: Metadata) {
    await browser.storage.local.set({ cache })
}

export async function getUserOptions(): Promise<UserOptions> {
    return (await browser.storage.local.get({ userOptions: defaultUserOptions })).userOptions
}

export async function saveUserOptions(userOptions: UserOptions) {
    await browser.storage.local.set({ userOptions })
}
