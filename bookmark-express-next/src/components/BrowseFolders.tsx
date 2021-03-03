import React, { useEffect, useState, MouseEvent } from 'react'
import { IconButton, makeStyles } from '@material-ui/core'
import TreeView from '@material-ui/lab/TreeView'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import TreeItem from '@material-ui/lab/TreeItem'
import { getFolders, isFolder } from '../utils/misc'
import { Favorite, Node } from '../react-app-env'
import StarIcon from '@material-ui/icons/Star'
import StarOutlineIcon from '@material-ui/icons/StarOutline'

interface Props {
    favoriteFolders?: Favorite[]
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

export function BrowseFolders({ favoriteFolders = [], mode, onFolderSelect }: Props) {
    const classes = useStyles()
    const [allFolders, setAllFolders] = useState<Node>()

    useEffect(() => {
        async function stupid() {
            const folders = await getFolders()
            setAllFolders(folders)
        }

        stupid()
    }, [])

    const renderTree = (node: Node | undefined) => {
        if (!node || !isFolder(node)) return null

        const isFolderFavorited = favoriteFolders.some((favorite) => favorite.id === node.id)

        return (
            <TreeItem
                key={node.id}
                nodeId={node.id}
                label={
                    <>
                        {node.title}
                        {mode === 'favorites' && (
                            <IconButton tabIndex={-1} onClick={(event) => onFolderSelect(node, event)}>
                                {isFolderFavorited ? (
                                    <StarIcon fontSize='small' />
                                ) : (
                                    <StarOutlineIcon fontSize='small' />
                                )}
                            </IconButton>
                        )}
                    </>
                }
                className={classes.treeItem}
                onClick={mode === 'browse' ? (event) => onFolderSelect(node, event) : undefined}
            >
                {Array.isArray(node.children) ? node.children.map((node) => renderTree(node)) : null}
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
            {/* Call for each permanent child folder Chromium requires so we can omit the root node */}
            {renderTree(allFolders?.children?.[0])}
            {renderTree(allFolders?.children?.[1])}
            {renderTree(allFolders?.children?.[2])}
        </TreeView>
    )
}
