import React, { useEffect, useState, MouseEvent } from 'react'
import {IconButton, makeStyles} from '@material-ui/core'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'
import { getFolders, isFolder } from '../utils/misc'
import { Node } from '../react-app-env'
import StarIcon from "@material-ui/icons/Star";
import StarOutlineIcon from "@material-ui/icons/StarOutline";

interface Props {
    mode: 'browse' | 'favorites'
    onFolderSelect: (folder: Node, event: MouseEvent<HTMLElement>) => void
}

const useStyles = makeStyles(() => ({
    treeView: {
        width: '100%',
    },
    treeItem: {
        '& .MuiTreeItem-label': {
            display: 'flex',
            alignItems: 'center',
            minHeight: '40px',
        },
    },
}))

export function BrowseFolders({ mode, onFolderSelect }: Props) {
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
                onClick={(event) => onFolderSelect(node, event)}
            >
                {Array.isArray(node.children) ? node.children.map((node) => renderFolderTree(node)) : null}
            </TreeItem>
        )
    }

    const renderFolderTreeWithFavorites = (node: Node | undefined) => {
        if (!node || !isFolder(node)) return null

        const isFolderFavorited = true
        // const isFolderFavorited = chipData.some((favoritedFolder) => favoritedFolder.key === node.id)

        return (
            <TreeItem
                key={node.id}
                nodeId={node.id}
                label={
                    <>
                        {node.title}
                        <IconButton tabIndex={-1} onClick={(event) => onFolderSelect(node, event)}>
                            {isFolderFavorited ? <StarIcon fontSize='small' /> : <StarOutlineIcon fontSize='small' />}
                        </IconButton>
                    </>
                }
                className={classes.treeItem}
            >
                {Array.isArray(node.children) ? node.children.map((node) => renderFolderTreeWithFavorites(node)) : null}
            </TreeItem>
        )
    }

    const render = mode === 'browse' ? renderFolderTree : renderFolderTreeWithFavorites

    return (
        <TreeView
            className={classes.treeView}
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            defaultExpanded={['0']}
        >
            {render(allFolders?.children?.[0])}
            {render(allFolders?.children?.[1])}
            {render(allFolders?.children?.[2])}
        </TreeView>
    )
}
