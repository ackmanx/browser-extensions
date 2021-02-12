import React from 'react'
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

function generate(element: any) {
    return [0, 1, 2].map((value) =>
        React.cloneElement(element, {
            key: value,
        })
    )
}

export function Results() {
    return (
        <List>
            {generate(
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <FolderIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary='What is the Execution Context & Stack in JavaScript? by David Shariff'
                        secondary='https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_Operators#Logical_AND'
                    />
                    <ListItemSecondaryAction>
                        <IconButton edge='end' aria-label='delete'>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            )}
        </List>
    )
}
