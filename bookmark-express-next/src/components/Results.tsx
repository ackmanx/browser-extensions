import React, { MouseEvent, useContext } from 'react'
import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Menu,
    MenuItem,
} from '@material-ui/core'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
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

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)
    const [currentBookmarkId, setCurrentBookmarkId] = React.useState<string | null>(null)

    async function handleOpenBookmark(bookmark: Bookmarks.BookmarkTreeNode) {
        context.cache.bookmarks[bookmark.id].timesAccessed++
        await saveCache(context.cache)
        window.open(bookmark.url)
    }

    const handleOpenMenu = (event: MouseEvent<HTMLElement>, bookmarkId: string) => {
        setCurrentBookmarkId(bookmarkId)
        setAnchorEl(event.currentTarget)
    }

    const handleCloseMenu = () => {
        setCurrentBookmarkId(null)
        setAnchorEl(null)
    }

    const handleResetCount = async (bookmarkId: string) => {
        console.log(777, 'resetting ', bookmarkId)
        handleCloseMenu()
    }

    const bookmarksSorted = context.results.sort(
        (a, b) => context.cache.bookmarks[b.id].timesAccessed - context.cache.bookmarks[a.id].timesAccessed
    )

    return (
        <List>
            {bookmarksSorted.map((bookmark) => {
                if (isFolder(bookmark)) return

                const metaForResult = context.cache.bookmarks[bookmark.id]
                const titleWithHighlights = highlightText(bookmark.title, context.query)
                const urlWithHighlights = highlightText(bookmark.url ?? '', context.query)

                return (
                    <ListItem button key={bookmark.id} onClick={() => handleOpenBookmark(bookmark)}>
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
                            <IconButton
                                edge='end'
                                tabIndex={-1}
                                onClick={(event) => handleOpenMenu(event, bookmark.id)}
                            >
                                <MoreHorizIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                keepMounted
                                open={currentBookmarkId === bookmark.id}
                                onClose={handleCloseMenu}
                                elevation={1}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <MenuItem onClick={() => handleResetCount(bookmark.id)}>Reset Count</MenuItem>
                            </Menu>
                        </ListItemSecondaryAction>
                    </ListItem>
                )
            })}
        </List>
    )
}
