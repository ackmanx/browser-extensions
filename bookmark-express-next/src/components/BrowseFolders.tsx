import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'
import { getFolders, isFolder } from '../utils/misc'
import { Node } from '../react-app-env'

interface Props {
    onFolderSelect: (parentId: string) => void
}

const useStyles = makeStyles(() => ({
    treeView: {
        width: '100%',
    },
    treeItem: {
        '& .MuiTreeItem-label': {
            display: 'flex',
            alignItems: 'center',
            height: '40px',
        },
    },
}))

export function BrowseFolders({ onFolderSelect }: Props) {
    const classes = useStyles()
    const [allFolders, setAllFolders] = useState<Node>()

    useEffect(() => {
        async function stupid() {
            const folders = await getFolders()
            setAllFolders(folders)
        }

        stupid()
    }, [])

    const renderFolderTree = (node: Node | undefined) => {
        if (!node || !isFolder(node)) return null

        return (
            <TreeItem
                key={node.id}
                nodeId={node.id}
                label={node.title}
                className={classes.treeItem}
                onClick={() => onFolderSelect(node.id)}
            >
                {Array.isArray(node.children) ? node.children.map((node) => renderFolderTree(node)) : null}
            </TreeItem>
        )
    }

    return (
        <TreeView
            className={classes.treeView}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            defaultExpanded={['0']}
        >
            {renderFolderTree(allFolders?.children?.[0])}
            {renderFolderTree(allFolders?.children?.[1])}
            {renderFolderTree(allFolders?.children?.[2])}
        </TreeView>
    )
}
