import React, { useContext } from 'react'
import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import AppContext from '../context/AppContext'
import { highlightText, isFolder } from '../utils/misc'
import { Bookmarks } from 'webextension-polyfill-ts'
import { saveCache } from '../utils/storage'

const useStyles = makeStyles({
    title: {
        '& .search-hit': {
            backgroundColor: '#3576CB',
            color: 'white',
        },
    },
    url: {
        fontSize: '12px',
        fontStyle: 'italic',
        color: 'gray',
        wordBreak: 'break-all',

        '& .search-hit': {
            backgroundColor: '#3576CB',
            color: 'white',
        },
    },
})

export function Results() {
    const context = useContext(AppContext)
    const classes = useStyles()

    async function handleOpenBookmark(bookmark: Bookmarks.BookmarkTreeNode) {
        context.cache.bookmarks[bookmark.id].timesAccessed++
        await saveCache(context.cache)
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
                const titleWithHighlights = highlightText(result.title, context.query)
                const urlWithHighlights = highlightText(result.url ?? '', context.query)

                return (
                    <ListItem button key={result.id} onClick={() => handleOpenBookmark(result)}>
                        <ListItemAvatar>
                            <Avatar src={`chrome://favicon/${result.url}`} />
                        </ListItemAvatar>
                        <ListItemText secondary={metaForResult.breadcrumbs}>
                            <>
                                <div
                                    className={classes.title}
                                    dangerouslySetInnerHTML={{ __html: titleWithHighlights }}
                                />
                                {context.userOptions.showUrls && (
                                    <div
                                        className={classes.url}
                                        dangerouslySetInnerHTML={{ __html: urlWithHighlights }}
                                    />
                                )}
                            </>
                        </ListItemText>
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
