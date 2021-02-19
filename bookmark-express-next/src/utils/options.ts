export interface UserOptions {
    showBreadcrumbs: boolean
    showUrls: boolean
}

export const defaultUserOptions: UserOptions = {
    showBreadcrumbs: true,
    showUrls: false,
}

export type UserOptionKey = 'showBreadcrumbs' | 'showUrls'
