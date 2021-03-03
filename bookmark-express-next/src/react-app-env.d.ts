/// <reference types="react-scripts" />
import { Bookmarks } from 'webextension-polyfill-ts'

export type Node = Bookmarks.BookmarkTreeNode

export interface Favorite {
    id: string
    title: string
}
