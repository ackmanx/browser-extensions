import React, { ChangeEvent, useContext } from 'react'
import { Grid, IconButton, makeStyles, OutlinedInput } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import { browser } from 'webextension-polyfill-ts'
import AppContext from '../context/AppContext'
import { isFolder } from '../utils/misc'
import FiberNewIcon from '@material-ui/icons/FiberNew'

const useStyles = makeStyles({
    search: {
        '&.Mui-focused fieldset': {
            borderColor: '#3576CB !important',
        },
    },
})

export function SearchBar() {
    const classes = useStyles()
    const context = useContext(AppContext)

    const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
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
        const bookmarks = (await browser.bookmarks.getRecent(30)).filter((bookmark) => !isFolder(bookmark))
        context.setResults(bookmarks)
    }

    const handleOpenOptionsPage = () => browser.runtime.openOptionsPage()

    return (
        <Grid container spacing={1}>
            <Grid item xs={10}>
                <OutlinedInput
                    fullWidth
                    autoFocus
                    placeholder='start typing'
                    onChange={handleSearch}
                    className={classes.search}
                />
            </Grid>
            <Grid item xs={2} container justify='center' alignItems='center'>
                <IconButton onClick={handleShowRecentlyAddedBookmarks}>
                    <FiberNewIcon />
                </IconButton>
                <IconButton onClick={handleOpenOptionsPage}>
                    <SettingsIcon />
                </IconButton>
            </Grid>
        </Grid>
    )
}
