import React, { MouseEvent, useContext } from 'react'
import { IconButton, Menu, MenuItem } from '@material-ui/core'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import AppContext from '../context/AppContext'
import { saveCache } from '../utils/storage'
import { Cache } from '../utils/cache'

interface Props {
    bookmarkId: string
}

export function ResultActions({ bookmarkId }: Props) {
    const context = useContext(AppContext)

    // Using this as both where to position the Menu, and also whether to show the menu
    // If there is an anchor set, then show it. Once the anchor is removed, close it
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null)

    const handleOpenMenu = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)
    const handleCloseMenu = () => setAnchorEl(null)

    const handleResetCount = async (bookmarkId: string) => {
        context.setCache((prevCache: Cache) => {
            const newCache: Cache = JSON.parse(JSON.stringify(prevCache))
            newCache.bookmarks[bookmarkId].timesAccessed = 0

            saveCache(newCache)

            return newCache
        })

        handleCloseMenu()
    }

    return (
        <>
            <IconButton edge='end' tabIndex={-1} onClick={(event) => handleOpenMenu(event)}>
                <MoreHorizIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={() => handleResetCount(bookmarkId)}>Reset Count</MenuItem>
            </Menu>
        </>
    )
}
