import React, { useContext } from 'react'
import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
} from '@material-ui/core'
import AppContext from '../context/AppContext'
import { highlightText, isFolder } from '../utils/misc'
import { Bookmarks } from 'webextension-polyfill-ts'
import { saveCache } from '../utils/storage'
import { ResultActions } from './ResultActions'

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
    justDeleted: {
        opacity: 0.2,
    },
})

export function Results() {
    const context = useContext(AppContext)
    const classes = useStyles()

    async function handleOpenBookmark(bookmark: Bookmarks.BookmarkTreeNode) {
        // Updating directly being the extension closes after this anyway
        context.cache.bookmarks[bookmark.id].timesAccessed++
        await saveCache(context.cache)

        window.open(bookmark.url)
    }

    const bookmarksSorted = context.results
        .filter((bookmark: Bookmarks.BookmarkTreeNode) => !isFolder(bookmark))
        .sort((a, b) => context.cache.bookmarks[b.id].timesAccessed - context.cache.bookmarks[a.id].timesAccessed)

    return (
        <List>
            {bookmarksSorted.map((bookmark) => {
                const metaForResult = context.cache.bookmarks[bookmark.id]
                const titleWithHighlights = highlightText(bookmark.title, context.query)
                const urlWithHighlights = highlightText(bookmark.url ?? '', context.query)

                return (
                    <ListItem
                        className={metaForResult.justDeleted ? classes.justDeleted : ''}
                        button
                        key={bookmark.id}
                        onClick={() => handleOpenBookmark(bookmark)}
                    >
                        <ListItemAvatar>
                            <Avatar src={`chrome://favicon/${bookmark.url}`} />
                        </ListItemAvatar>
                        <ListItemText secondary={context.userOptions.showBreadcrumbs && metaForResult.breadcrumbs}>
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
                            <ResultActions bookmarkId={bookmark.id} />
                        </ListItemSecondaryAction>
                    </ListItem>
                )
            })}
        </List>
    )
}
