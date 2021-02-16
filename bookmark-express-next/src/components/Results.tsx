import React, { useContext } from 'react'
import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import AppContext from '../context/AppContext'
import { isFolder } from '../utils/misc-utils'
import { Bookmarks } from 'webextension-polyfill-ts'
import { saveCache } from '../utils/local-storage'

export function Results() {
    const context = useContext(AppContext)

    function handleOpenBookmark(bookmark: Bookmarks.BookmarkTreeNode) {
        context.cache.bookmarks[bookmark.id].timesAccessed++
        saveCache(context.cache)
        window.open(bookmark.url)
    }

    const bookmarksSorted = context.results.sort(
        (a, b) => context.cache.bookmarks[b.id].timesAccessed - context.cache.bookmarks[a.id].timesAccessed
    )

    return (
        <List>
            {bookmarksSorted.map((result) => {
                if (isFolder(result)) return

                const metaForResult = context.cache.bookmarks[result.id]

                return (
                    <ListItem button key={result.id} onClick={() => handleOpenBookmark(result)}>
                        <ListItemAvatar>
                            <Avatar src={`chrome://favicon/${result.url}`} />
                        </ListItemAvatar>
                        <ListItemText primary={result.title} secondary={metaForResult.breadcrumbs} />
                        <ListItemSecondaryAction>
                            <IconButton edge='end' tabIndex={-1}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                )
            })}
        </List>
    )
}
