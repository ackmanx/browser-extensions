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
import { saveMetadata } from '../utils/storage'
import { ResultActions } from './ResultActions'
import { Node } from '../react-app-env'

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

    if (!context.results.length) return null

    async function handleOpenBookmark(bookmark: Node) {
        // Updating directly being the extension closes after this anyway
        context.metadata.bookmarks[bookmark.id].timesAccessed++
        await saveMetadata(context.metadata)

        window.open(bookmark.url)
    }

    let bookmarks: Node[] = context.results.filter((bookmark: Node) => !isFolder(bookmark))

    if (context.viewMode === 'search') {
        bookmarks = bookmarks.sort(
            (a, b) => context.metadata.bookmarks[b.id].timesAccessed - context.metadata.bookmarks[a.id].timesAccessed
        )
    }

    return (
        <List>
            {bookmarks.map((bookmark) => {
                const metaForResult = context.metadata.bookmarks[bookmark.id]
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
