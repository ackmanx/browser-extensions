import React, { useEffect, useState } from 'react'
import {
    Accordion as MuiAccordion,
    AccordionDetails as MuiAccordionDetails,
    AccordionSummary as MuiAccordionSummary,
    Chip,
    makeStyles,
    Typography,
    withStyles,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { getFolders, getRecentFolders } from '../../utils/misc'
import { Node } from '../../react-app-env'
import { Bookmarks } from 'webextension-polyfill-ts'
import { BrowseFolders } from '../BrowseFolders'

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

interface Props {
    createDetails: Bookmarks.CreateDetails
    onFolderSelect: (parentId: string) => void
}

const useStyles = makeStyles((theme) => ({
    recentFolders: {
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(0.5),
        },
    },
}))

export function FolderSelection({ createDetails, onFolderSelect }: Props) {
    const classes = useStyles()
    const [recentFolders, setRecentFolders] = useState<Node[]>([])
    const [expanded, setExpanded] = React.useState('')

    useEffect(() => {
        async function stupid() {
            setRecentFolders(getRecentFolders(await getFolders()))
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
                    <Typography>Favorites</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>Favorites</Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel2'} onChange={handleToggleAccordion('panel2')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Recently Used</Typography>
                </AccordionSummary>
                <AccordionDetails className={classes.recentFolders}>
                    {recentFolders.map((folder) => (
                        <Chip
                            key={folder.id}
                            label={folder.title}
                            color={folder.id === createDetails.parentId ? 'primary' : 'default'}
                            variant={folder.id === createDetails.parentId ? 'default' : 'outlined'}
                            onClick={() => onFolderSelect(folder.id)}
                        />
                    ))}
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel3'} onChange={handleToggleAccordion('panel3')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Browse</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <BrowseFolders onFolderSelect={onFolderSelect} />
                </AccordionDetails>
            </Accordion>
        </>
    )
}
