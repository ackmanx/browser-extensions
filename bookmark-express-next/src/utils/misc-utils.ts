import { Bookmarks } from 'webextension-polyfill-ts'

export function isFolder(bookmark: Bookmarks.BookmarkTreeNode) {
    //Folders don't have URLs, and bookmarks do
    return !!bookmark.url
}
