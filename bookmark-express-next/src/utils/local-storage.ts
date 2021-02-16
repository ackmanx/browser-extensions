import { Cache } from './cache'

export function getBookmarksHash() {
    return localStorage.getItem('bookmarks-hash')
}

export function saveBookmarksHash(hash: string) {
    localStorage.setItem('bookmarks-hash', hash)
}

export function getCache(): Cache {
    let cache: Cache

    try {
        cache = JSON.parse(localStorage.getItem('cache') || '{}')
    } catch (e: any) {
        throw new Error('Yikes! Cache is malformed!')
    }

    return cache
}

export function saveCache(cache: Cache) {
    localStorage.setItem('cache', JSON.stringify(cache))
}
