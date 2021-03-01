import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
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

    useEffect(() => {
        ;(async () => {
            setAllFolders(await getFolders())
        })()
    }, [])

    const renderFolderTree = (node: Bookmarks.BookmarkTreeNode | undefined) => {
        if (!node || !isFolder(node)) return null

        return (
            <TreeItem key={node.id} nodeId={node.id} label={node.title}>
                {Array.isArray(node.children) ? node.children.map((node) => renderFolderTree(node)) : null}
            </TreeItem>
        )
    }

    return (
        <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            defaultExpanded={['0']}
        >
            {renderFolderTree(allFolders)}
        </TreeView>
    )
}
