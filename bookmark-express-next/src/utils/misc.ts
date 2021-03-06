import { browser } from 'webextension-polyfill-ts'
import { Node } from 'react-app-env'

export function isFolder(bookmark: Node) {
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

    return removeBookmarks(bookmarks, {} as Node)
}

function removeBookmarks(node: Node, parentNode: Node) {
    if (node.children) {
        node.children.map((child) => removeBookmarks(child, node))
    } else {
        parentNode.children = parentNode.children?.filter((leaf) => !leaf.url)
    }

    return node
}

export function getRecentFolders(folders: Node) {
    return flattenFolders(folders, [] as Node[])
        .sort((a: Node, b: Node) => (b.dateGroupModified ?? 0) - (a.dateGroupModified ?? 0))
        .slice(0, 14)
}

function flattenFolders(node: Node, recentFolders: Node[]) {
    if (node.children) {
        if (node.dateGroupModified) {
            recentFolders.push(node)
        }

        node.children.map((child) => flattenFolders(child, recentFolders))
    }

    return recentFolders
}
