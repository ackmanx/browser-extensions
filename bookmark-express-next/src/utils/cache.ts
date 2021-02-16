import { Bookmarks, browser } from 'webextension-polyfill-ts'
import md5 from 'md5'
import { getBookmarksHash, saveBookmarksHash, saveCache } from './local-storage'
import { isFolder } from './misc-utils'

export interface Cache {
    bookmarks: Record<string, BookmarkCacheEntry>
}

interface BookmarkCacheEntry {
    path: string
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

export async function buildCache() {
    const rootBookmarkTree = (await browser.bookmarks.getTree())[0]
    const cache = processNode(rootBookmarkTree, [], { bookmarks: {} })

    saveCache(cache)

    return cache
}

function processNode(bookmarkNode: Bookmarks.BookmarkTreeNode, folderNameStack: string[], cache: Cache) {
    //Every node has a title except the root node, and we don't want that in the breadcrumbs
    if (bookmarkNode.title) {
        folderNameStack.push(bookmarkNode.title)
    }

    if (isFolder(bookmarkNode)) {
        bookmarkNode.children?.forEach((childNode) => processNode(childNode, folderNameStack, cache))
    } else {
        if (!cache.bookmarks[bookmarkNode.id]) {
            cache.bookmarks[bookmarkNode.id] = { path: '' }
        }

        cache.bookmarks[bookmarkNode.id].path = folderNameStack.slice(0, -1).join(' / ')
    }

    folderNameStack.pop()

    return cache
}
