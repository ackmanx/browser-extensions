import React, { useEffect, useState } from 'react'
import { Accordion, AccordionDetails, AccordionSummary, makeStyles, Typography } from '@material-ui/core'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'
import { Bookmarks } from 'webextension-polyfill-ts'
import { getFolders, isFolder } from '../utils/misc'

const useStyles = makeStyles((theme) => ({}))

export function FolderSelection() {
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
            <TreeItem key={node.id} nodeId={node.id} label={node.title}>
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
                        defaultCollapseIcon={<ExpandMoreIcon />}
                        defaultExpandIcon={<ChevronRightIcon />}
                        defaultExpanded={['0']}
                    >
                        {renderFolderTree(allFolders)}
                    </TreeView>
                </AccordionDetails>
            </Accordion>
        </>
    )
}
