import { Bookmarks, browser } from 'webextension-polyfill-ts'
import md5 from 'md5'

interface CacheEntry {
    path: string
}

export async function isCacheStale() {
    const { children: bookmarks } = (await browser.bookmarks.getTree())[0]

    const freshHash = md5(JSON.stringify(bookmarks))
    const savedHash = localStorage.getItem('bookmarks-hash')

    return freshHash !== savedHash
}

export async function buildCache() {
    const rootBookmarkTree = (await browser.bookmarks.getTree())[0]
    return buildPaths(rootBookmarkTree, [], {})
}

function buildPaths(
    bookmarkNode: Bookmarks.BookmarkTreeNode,
    folderNameStack: string[],
    cache: Record<string, CacheEntry>
) {
    //Everything has a title except the root node, and we don't want that in our stack
    if (bookmarkNode.title) {
        folderNameStack.push(bookmarkNode.title)
    }

    //Folders don't have url properties, so we know to go deeper
    if (!bookmarkNode.url) {
        bookmarkNode.children?.forEach((childNode) => buildPaths(childNode, folderNameStack, cache))
    } else {
        if (!cache[bookmarkNode.id]) {
            cache[bookmarkNode.id] = { path: '' }
        }

        cache[bookmarkNode.id].path = folderNameStack.slice(0, -1).join(' / ')
    }

    folderNameStack.pop()

    return cache
}
