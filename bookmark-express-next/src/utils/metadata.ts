import { Bookmarks, browser } from 'webextension-polyfill-ts'
import md5 from 'md5'
import { getCache, getBookmarksHash, saveBookmarksHash, saveCache } from './storage'
import { isFolder } from './misc'

export interface Metadata {
    bookmarks: Record<string, BookmarkMetadataEntry>
}

interface BookmarkMetadataEntry {
    breadcrumbs: string
    timesAccessed: number
    justDeleted: boolean
}

export const defaultMetadata: Metadata = {
    bookmarks: {},
}

export async function isMetadataStale() {
    const { children: bookmarks } = (await browser.bookmarks.getTree())[0]

    const freshHash = md5(JSON.stringify(bookmarks))
    const savedHash = await getBookmarksHash()

    await saveBookmarksHash(freshHash)

    return freshHash !== savedHash
}

/*
 * Re-builds the metadata we persist in storage
 * To avoid a memory leak, we start fresh so we don't keep stale data from deleted bookmarks
 * But, we keep the data for timesAccessed, for example, because that won't change between rebuilds
 */
export async function buildMetadata() {
    const rootBookmarkTree = (await browser.bookmarks.getTree())[0]
    const metadata = processNode(rootBookmarkTree, [], { ...defaultMetadata }, await getCache())

    await saveCache(metadata)

    return metadata
}

function processNode(
    bookmarkNode: Bookmarks.BookmarkTreeNode,
    folderNameStack: string[],
    freshMetadata: Metadata,
    staleMetadata: Metadata
) {
    //Every node has a title except the root node, and we don't want that in the breadcrumbs
    if (bookmarkNode.title) {
        folderNameStack.push(bookmarkNode.title)
    }

    if (isFolder(bookmarkNode)) {
        bookmarkNode.children?.forEach((childNode) => processNode(childNode, folderNameStack, freshMetadata, staleMetadata))
    } else {
        freshMetadata.bookmarks[bookmarkNode.id] = {
            breadcrumbs: folderNameStack.slice(0, -1).join(' / '),
            timesAccessed: staleMetadata.bookmarks[bookmarkNode.id]?.timesAccessed ?? 0,
            justDeleted: false,
        }
    }

    folderNameStack.pop()

    return freshMetadata
}
