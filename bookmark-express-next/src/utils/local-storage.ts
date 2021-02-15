import { Cache } from './cache-utils'

export function getBookmarksHash() {
    return localStorage.getItem('bookmarks-hash')
}

export function saveBookmarksHash(hash: string) {
    return localStorage.setItem('bookmarks-hash', hash)
}

export function saveCache(cache: Cache) {
    localStorage.setItem('cache', JSON.stringify(cache))
}
