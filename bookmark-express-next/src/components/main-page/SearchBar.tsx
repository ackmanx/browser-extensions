import React, { ChangeEvent, useContext } from 'react'
import { Grid, IconButton, makeStyles, OutlinedInput } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import { browser } from 'webextension-polyfill-ts'
import AppContext from 'context/AppContext'
import { isFolder } from 'utils/misc'
import { Add, History as RecentIcon } from '@material-ui/icons'

const useStyles = makeStyles({
    search: {
        '&.Mui-focused fieldset': {
            borderColor: '#3f51b5 !important',
        },
    },
})

export function SearchBar() {
    const classes = useStyles()
    const context = useContext(AppContext)

    const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
        context.setViewMode('search')

        const query = event.target.value

        if (query.length <= 1) {
            context.setResults([])
            return
        }

        const bookmarks = (await browser.bookmarks.search(query)).filter((bookmark) => !isFolder(bookmark))

        context.setQuery(query)
        context.setResults(bookmarks)
    }

    const handleShowRecentlyAddedBookmarks = async () => {
        context.setViewMode('recent')

        const bookmarks = (await browser.bookmarks.getRecent(30)).filter((bookmark) => !isFolder(bookmark))
        context.setResults(bookmarks)
    }

    const handleBookmarkCurrentPage = async () => {
        context.setViewMode('add')
    }

    const handleOpenOptionsPage = () => browser.runtime.openOptionsPage()

    return (
        <Grid container spacing={1}>
            <Grid item xs={9}>
                <OutlinedInput
                    fullWidth
                    autoFocus
                    placeholder='start typing'
                    onChange={handleSearch}
                    className={classes.search}
                />
            </Grid>
            <Grid item xs={3} container justify='center' alignItems='center'>
                <IconButton title='Bookmark Current Page' tabIndex={-1} onClick={handleBookmarkCurrentPage}>
                    <Add />
                </IconButton>
                <IconButton title='Show Recently Added Bookmarks' tabIndex={-1} onClick={handleShowRecentlyAddedBookmarks}>
                    <RecentIcon />
                </IconButton>
                <IconButton title='Open Settings' tabIndex={-1} onClick={handleOpenOptionsPage}>
                    <SettingsIcon />
                </IconButton>
            </Grid>
        </Grid>
    )
}
