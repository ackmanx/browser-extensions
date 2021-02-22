import { Bookmarks, browser } from 'webextension-polyfill-ts'
import md5 from 'md5'
import { getCache, getBookmarksHash, saveBookmarksHash, saveCache } from './storage'
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
    const savedHash = await getBookmarksHash()

    await saveBookmarksHash(freshHash)

    return freshHash !== savedHash
}

/*
 * Re-builds the cache, but not something is scraped
 * To avoid a memory leak, we start fresh so we don't keep data from deleted bookmarks
 * But, we keep the data for timesAccessed, for example, because that won't change between rebuilds
 */
export async function buildCache() {
    const rootBookmarkTree = (await browser.bookmarks.getTree())[0]
    const cache = processNode(rootBookmarkTree, [], { ...defaultCache }, await getCache())

    await saveCache(cache)

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

// export async function resetTimesAccessedCount(cache: Cache, bookmarkId: string) {
//     console.log(777, 'resetting', bookmarkId, cache.bookmarks[bookmarkId])
//     cache.bookmarks[bookmarkId].timesAccessed = 0
//     await saveCache(cache)
// }
