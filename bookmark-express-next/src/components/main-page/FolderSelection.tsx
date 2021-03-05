import React, { useEffect, useState } from 'react'
import {
    Accordion as MuiAccordion,
    AccordionDetails as MuiAccordionDetails,
    AccordionSummary as MuiAccordionSummary,
    Chip,
    Grid,
    makeStyles,
    Typography,
    withStyles,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { getFolders, getRecentFolders } from 'utils/misc'
import { Favorite, Node } from 'react-app-env'
import { Bookmarks } from 'webextension-polyfill-ts'
import { BrowseFolders } from 'components/BrowseFolders'
import { getFavorites } from '../../utils/storage'

interface Props {
    createDetails: Bookmarks.CreateDetails
    onFolderSelect: (folder: Node) => void
}

const Accordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiAccordion)

const AccordionSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        sectionSpacing: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary)

const AccordionDetails = withStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiAccordionDetails)

const useStyles = makeStyles((theme) => ({
    recentFolders: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
    noFavorites: { color: 'gray' },
}))

export function FolderSelection({ createDetails, onFolderSelect }: Props) {
    const classes = useStyles()
    const [recentFolders, setRecentFolders] = useState<Node[]>([])
    const [favorites, setFavorites] = useState<Favorite[]>([])
    const [expanded, setExpanded] = React.useState('')

    useEffect(() => {
        async function stupid() {
            setRecentFolders(getRecentFolders(await getFolders()))
            setFavorites(await getFavorites())
        }

        stupid()
    }, [])

    const handleToggleAccordion = (panel: any) => (event: any, isExpanded: any) => {
        setExpanded(isExpanded ? panel : false)
    }

    return (
        <>
            <Accordion expanded={expanded === 'panel1'} onChange={handleToggleAccordion('panel1')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Favorite Folders</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {!favorites.length && (
                        <Grid container justify='center'>
                            <Typography className={classes.noFavorites}>
                                You can add folders to your favorites in the options
                            </Typography>
                        </Grid>
                    )}
                    {favorites.map((folder) => (
                        <Chip
                            key={folder.id}
                            label={folder.title}
                            color={folder.id === createDetails.parentId ? 'primary' : 'default'}
                            onClick={() => onFolderSelect(folder)}
                        />
                    ))}
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel2'} onChange={handleToggleAccordion('panel2')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Recently Used Folders</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.recentFolders}>
                    {recentFolders.map((folder) => (
                        <Chip
                            key={folder.id}
                            label={folder.title}
                            color={folder.id === createDetails.parentId ? 'primary' : 'default'}
                            onClick={() => onFolderSelect(folder)}
                        />
                    ))}
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel3'} onChange={handleToggleAccordion('panel3')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Browse Folders</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <BrowseFolders mode='browse' onFolderSelect={onFolderSelect} />
                </AccordionDetails>
            </Accordion>
        </>
    )
}
