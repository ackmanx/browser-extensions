import React, { MouseEvent, useContext } from 'react'
import { IconButton, Menu, MenuItem } from '@material-ui/core'
import MoreHorizIcon from '@material-ui/icons/MoreHoriz'
import AppContext from 'context/AppContext'
import { saveMetadata } from 'utils/storage'
import { Metadata } from 'utils/metadata'
import { browser } from 'webextension-polyfill-ts'

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

    const handleDelete = async (bookmarkId: string) => {
        await browser.bookmarks.remove(bookmarkId)

        // React won't re-render from this assignment because I'm not using the setter, so set metadata afterwards with a new reference
        context.metadata.bookmarks[bookmarkId].justDeleted = true
        context.setMetadata({ ...context.metadata })

        handleCloseMenu()
    }

    const handleResetCount = async (bookmarkId: string) => {
        context.setMetadata((prevMetadata: Metadata) => {
            const newMetadata: Metadata = JSON.parse(JSON.stringify(prevMetadata))
            newMetadata.bookmarks[bookmarkId].timesAccessed = 0

            saveMetadata(newMetadata)

            return newMetadata
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
                <MenuItem onClick={() => handleDelete(bookmarkId)}>Delete</MenuItem>
                <MenuItem onClick={() => handleResetCount(bookmarkId)}>Reset Count</MenuItem>
            </Menu>
        </>
    )
}
