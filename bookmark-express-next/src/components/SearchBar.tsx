import React, { ChangeEvent, useContext } from 'react'
import { Grid, IconButton, OutlinedInput } from '@material-ui/core'
import SettingsIcon from '@material-ui/icons/Settings'
import { browser } from 'webextension-polyfill-ts'
import AppContext from '../context/AppContext'
import { isFolder } from '../utils/misc'
import FiberNewIcon from '@material-ui/icons/FiberNew'

export function SearchBar() {
    const context = useContext(AppContext)

    const handleSearch = async (event: ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value

        if (query.length <= 1) {
            context.updateResults([])
            return
        }

        const bookmarks = (await browser.bookmarks.search(query)).filter((bookmark) => !isFolder(bookmark))

        context.setQuery(query)
        context.updateResults(bookmarks)
    }

    const handleOpenOptionsPage = () => browser.runtime.openOptionsPage()

    return (
        <Grid container spacing={1}>
            <Grid item xs={10}>
                <OutlinedInput fullWidth autoFocus placeholder='start typing' onChange={handleSearch} />
            </Grid>
            <Grid item xs={2} container justify='center' alignItems='center'>
                <IconButton>
                    <FiberNewIcon />
                </IconButton>
                <IconButton onClick={handleOpenOptionsPage}>
                    <SettingsIcon />
                </IconButton>
            </Grid>
        </Grid>
    )
}
