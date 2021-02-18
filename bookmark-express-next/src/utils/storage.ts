import { browser } from 'webextension-polyfill-ts'
import { Cache, defaultCache } from './cache'

export async function getBookmarksHash(): Promise<string> {
    console.log(777, await browser.storage.local.get())
    return (await browser.storage.local.get()).bookmarksHash
}

export async function saveBookmarksHash(bookmarksHash: string) {
    await browser.storage.local.set({ bookmarksHash })
}

export async function getCache(): Promise<Cache> {
    return (await browser.storage.local.get({ cache: defaultCache })).cache
}

export async function saveCache(cache: Cache) {
    await browser.storage.local.set({ cache })
}
