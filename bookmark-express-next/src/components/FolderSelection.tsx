import React, { useEffect, useState } from 'react'
import {
    Accordion as MuiAccordion,
    AccordionDetails as MuiAccordionDetails,
    AccordionSummary as MuiAccordionSummary,
    makeStyles,
    Typography,
    withStyles,
} from '@material-ui/core'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'
import { Bookmarks } from 'webextension-polyfill-ts'
import { getFolders, isFolder } from '../utils/misc'

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
    onFolderSelect: (parentId: string) => void
}

const useStyles = makeStyles({
    treeRoot: {
        width: '100%',
    },
})

export function FolderSelection({ onFolderSelect }: Props) {
    const classes = useStyles()
    const [allFolders, setAllFolders] = useState<Bookmarks.BookmarkTreeNode>()
    const [expanded, setExpanded] = React.useState('')

    useEffect(() => {
        ;(async () => {
            setAllFolders(await getFolders())
        })()
    }, [])

    const handleChange = (panel: any) => (event: any, isExpanded: any) => {
        setExpanded(isExpanded ? panel : false)
    }

    const renderFolderTree = (node: Bookmarks.BookmarkTreeNode | undefined) => {
        if (!node || !isFolder(node)) return null

        return (
            <TreeItem key={node.id} nodeId={node.id} label={node.title} onClick={() => onFolderSelect(node.id)}>
                {Array.isArray(node.children) ? node.children.map((node) => renderFolderTree(node)) : null}
            </TreeItem>
        )
    }

    return (
        <>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Favorites</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>Favorites</Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Recently Used</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>Recently Used</Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Browse</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <TreeView
                        className={classes.treeRoot}
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                        defaultExpanded={['0']}
                    >
                        {renderFolderTree(allFolders?.children?.[0])}
                        {renderFolderTree(allFolders?.children?.[1])}
                        {renderFolderTree(allFolders?.children?.[2])}
                    </TreeView>
                </AccordionDetails>
            </Accordion>
        </>
    )
}
