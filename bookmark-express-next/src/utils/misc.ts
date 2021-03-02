import { Bookmarks, browser } from 'webextension-polyfill-ts'

// type Node = Bookmarks.BookmarkTreeNode

export function isFolder(bookmark: Bookmarks.BookmarkTreeNode) {
    //Folders can't have URLs
    return !bookmark.url
}

function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function highlightText(sourceText: string, searchQuery: string) {
    const searchHits: string[] = []
    let highlightedText = sourceText
    const queryParts = searchQuery
        .trim()
        .split(' ')
        .filter((query: string) => query.length > 1)

    queryParts.forEach((queryPart: string, index: number) => {
        const replaceText = '\t' + index + '\t'
        const searchHitStringIndex = highlightedText.toLowerCase().indexOf(queryPart.toLowerCase())
        searchHits[index] = highlightedText.substr(searchHitStringIndex, queryPart.length)
        highlightedText = highlightedText.replace(new RegExp(escapeRegExp(queryPart), 'gi'), replaceText)
    })

    queryParts.forEach((queryPart: string, index: number) => {
        const replaceText = '<span class="search-hit">' + searchHits[index] + '</span>'
        highlightedText = highlightedText.replace(new RegExp('\t' + index + '\t', 'g'), replaceText)
    })

    return highlightedText
}

export async function getFolders() {
    const bookmarks = (await browser.bookmarks.getTree())[0]
    bookmarks.title = 'All Folders'

    return removeBookmarks(bookmarks, {} as Bookmarks.BookmarkTreeNode)
}

function removeBookmarks(node: Bookmarks.BookmarkTreeNode, parentNode: Bookmarks.BookmarkTreeNode) {
    if (node.children) {
        node.children.map((child) => removeBookmarks(child, node))
    } else {
        parentNode.children = parentNode.children?.filter((leaf) => !leaf.url)
    }

    return node
}

export function getRecentFolders(folders: Bookmarks.BookmarkTreeNode) {
    const flattened = flattenFolders(folders, [] as Bookmarks.BookmarkTreeNode[])

    const sorted = flattened.sort(
        (a: Bookmarks.BookmarkTreeNode, b: Bookmarks.BookmarkTreeNode) => b.dateGroupModified - a.dateGroupModified
    )

    return sorted
}

function flattenFolders(node: Bookmarks.BookmarkTreeNode, recentFolders: Bookmarks.BookmarkTreeNode[]) {
    if (node.children) {
        if (node.dateGroupModified) {
            recentFolders.push(node)
        }

        node.children.map((child) => flattenFolders(child, recentFolders))
    }

    return recentFolders
}
