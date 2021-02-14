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
import FolderIcon from '@material-ui/icons/Folder'
import DeleteIcon from '@material-ui/icons/Delete'
import ResultsContext from './ResultsContext'

export function Results() {
    const resultsContext = useContext(ResultsContext)

    return (
        <List>
            {resultsContext.results.map(result => {
                //Hide folders
                if (!result.url) return

                return (
                    <ListItem key={result.id}>
                        <ListItemAvatar>
                            <Avatar>
                                <FolderIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={result.title}
                            secondary={result.id}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge='end' aria-label='delete'>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                )
            })}
        </List>
    )
}
