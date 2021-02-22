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

    //Material UI decides whether the menu is open or not based on if it has an anchor element
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

    async function handleOpenBookmark(bookmark: Bookmarks.BookmarkTreeNode) {
        context.cache.bookmarks[bookmark.id].timesAccessed++
        await saveCache(context.cache)
        window.open(bookmark.url)
    }

    const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleCloseMenu = () => setAnchorEl(null)

    const handleResetCount = async (bookmarkId: string) => {
        console.log(777, 'resetting ', bookmarkId)
        // await resetTimesAccessedCount(context.cache, bookmarkId)
        setAnchorEl(null)
    }

    const bookmarksSorted = context.results.sort(
        (a, b) => context.cache.bookmarks[b.id].timesAccessed - context.cache.bookmarks[a.id].timesAccessed
    )

    console.log(777, '\n------------ render ---------------\n')

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
                        <ListItemText
                            secondary={context.userOptions.showBreadcrumbs && metaForResult.breadcrumbs}
                        >
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
                            <IconButton edge='end' tabIndex={-1} onClick={handleOpenMenu}>
                                <MoreHorizIcon />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
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
                                <MenuItem onClick={handleCloseMenu}>Edit</MenuItem>
                                <MenuItem onClick={handleCloseMenu}>Delete</MenuItem>
                                <MenuItem onClick={() => handleResetCount(result.id)}>Reset Count</MenuItem>
                            </Menu>
                        </ListItemSecondaryAction>
                    </ListItem>
                )
            })}
        </List>
    )
}
