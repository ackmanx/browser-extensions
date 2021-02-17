import { Bookmarks, browser } from 'webextension-polyfill-ts'
import md5 from 'md5'
import { getBookmarksHash, getCache, saveBookmarksHash, saveCache } from './local-storage'
import { isFolder } from './misc'

export interface Cache {
    bookmarks: Record<string, BookmarkCacheEntry>
}

interface BookmarkCacheEntry {
    breadcrumbs: string
    timesAccessed: number
}

export const defaultCache: Cache = {
    bookmarks: {},
}

export async function isCacheStale() {
    const { children: bookmarks } = (await browser.bookmarks.getTree())[0]

    const freshHash = md5(JSON.stringify(bookmarks))
    const savedHash = getBookmarksHash()

    saveBookmarksHash(freshHash)

    return freshHash !== savedHash
}

/*
 * Re-builds the cache, but not something is scraped
 * To avoid a memory leak, we start fresh so we don't keep data from deleted bookmarks
 * But, we keep the data for timesAccessed, for example, because that won't change between rebuilds
 */
export async function buildCache() {
    const rootBookmarkTree = (await browser.bookmarks.getTree())[0]
    const cache = processNode(rootBookmarkTree, [], { ...defaultCache }, getCache())

    saveCache(cache)

    return cache
}

function processNode(
    bookmarkNode: Bookmarks.BookmarkTreeNode,
    folderNameStack: string[],
    freshCache: Cache,
    staleCache: Cache
) {
    //Every node has a title except the root node, and we don't want that in the breadcrumbs
    if (bookmarkNode.title) {
        folderNameStack.push(bookmarkNode.title)
    }

    if (isFolder(bookmarkNode)) {
        bookmarkNode.children?.forEach((childNode) => processNode(childNode, folderNameStack, freshCache, staleCache))
    } else {
        freshCache.bookmarks[bookmarkNode.id] = {
            breadcrumbs: folderNameStack.slice(0, -1).join(' / '),
            timesAccessed: staleCache.bookmarks[bookmarkNode.id]?.timesAccessed ?? 0,
        }
    }

    folderNameStack.pop()

    return freshCache
}
