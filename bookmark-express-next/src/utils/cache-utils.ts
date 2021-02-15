import { Bookmarks, browser } from 'webextension-polyfill-ts'
import md5 from 'md5'
import { getBookmarksHash, saveBookmarksHash, saveCache } from './local-storage'

export interface Cache {
    bookmarks: Record<string, BookmarkCacheEntry>
}

interface BookmarkCacheEntry {
    path: string
}

export const defaultCache: Cache = {
    bookmarks: {}
}

export async function isCacheStale() {
    const { children: bookmarks } = (await browser.bookmarks.getTree())[0]

    const freshHash = md5(JSON.stringify(bookmarks))
    const savedHash = getBookmarksHash()

    saveBookmarksHash(freshHash)

    return freshHash !== savedHash
}

export async function buildCache() {
    const rootBookmarkTree = (await browser.bookmarks.getTree())[0]
    const cache = buildPaths(rootBookmarkTree, [], { bookmarks: {} })

    saveCache(cache)

    return cache
}

function buildPaths(bookmarkNode: Bookmarks.BookmarkTreeNode, folderNameStack: string[], cache: Cache) {
    //Everything has a title except the root node, and we don't want that in our stack
    if (bookmarkNode.title) {
        folderNameStack.push(bookmarkNode.title)
    }

    //Folders don't have url properties, so we know to go deeper
    if (!bookmarkNode.url) {
        bookmarkNode.children?.forEach((childNode) => buildPaths(childNode, folderNameStack, cache))
    } else {
        if (!cache.bookmarks[bookmarkNode.id]) {
            cache.bookmarks[bookmarkNode.id] = { path: '' }
        }

        cache.bookmarks[bookmarkNode.id].path = folderNameStack.slice(0, -1).join(' / ')
    }

    folderNameStack.pop()

    return cache
}
