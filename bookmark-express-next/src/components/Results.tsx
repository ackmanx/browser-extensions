import React, { useContext } from 'react'
import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'
import AppContext from '../context/AppContext'
import {isFolder} from "../utils/misc-utils";

export function Results() {
    const context = useContext(AppContext)

    function handleOpenBookmark(url: string = '') {
        window.open(url)
    }

    return (
        <List>
            {context.results.map((result) => {
                if (isFolder(result)) return

                const metaForResult = context.cache.bookmarks[result.id]

                return (
                    <ListItem button key={result.id} onClick={() => handleOpenBookmark(result.url)}>
                        <ListItemAvatar>
                            <Avatar src={`chrome://favicon/${result.url}`} />
                        </ListItemAvatar>
                        <ListItemText primary={result.title} secondary={metaForResult.path} />
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
