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

export function Results() {
    const context = useContext(AppContext)

    function handleOpenBookmark(url: string = '') {
        window.open(url)
    }

    return (
        <List>
            {context.results.map((result) => {
                //Hide folders
                if (!result.url) return

                // const meta = context.cache

                return (
                    <ListItem button key={result.id} onClick={() => handleOpenBookmark(result.url)}>
                        <ListItemAvatar>
                            <Avatar src={`chrome://favicon/${result.url}`} />
                        </ListItemAvatar>
                        <ListItemText primary={result.title} secondary={result.id} />
                        <ListItemSecondaryAction>
                            <IconButton edge='end'>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                )
            })}
        </List>
    )
}
