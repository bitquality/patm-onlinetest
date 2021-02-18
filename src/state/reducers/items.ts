export function itemsHaveError(state = false, action:any) {
    switch (action.type) {
        case 'ITEMS_HAVE_ERROR':
            return action.hasError;

        default:
            return state;
    }
}

export function itemsAreLoading(state = false, action:any) {
    switch (action.type) {
        case 'ITEMS_ARE_LOADING':
            return action.isLoading;

        default:
            return state;
    }
}

export function items(state = null, action:any) {
    switch (action.type) {
        case 'ITEMS_FETCH_DATA_SUCCESS':
            return action.items;

        default:
            return state;
    }
}
