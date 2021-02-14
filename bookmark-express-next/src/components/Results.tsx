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
import ResultsContext from '../context/ResultsContext'

export function Results() {
    const resultsContext = useContext(ResultsContext)

    function handleOpenBookmark(url: string = '') {
        window.open(url)
    }

    return (
        <List>
            {resultsContext.results.map((result) => {
                //Hide folders
                if (!result.url) return

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
