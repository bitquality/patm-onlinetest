import axios from 'axios';
import { IExpenseReceipt } from '../../types';

export function itemsHaveError(bool:Boolean) {
    return {
        type: 'ITEMS_HAVE_ERROR',
        hasError: bool
    };
}

export function itemsAreLoading(bool:Boolean) {
    return {
        type: 'ITEMS_ARE_LOADING',
        isLoading: bool
    };
}

export function itemsFetchDataSuccess(items:[]) {
    return {
        type: 'ITEMS_FETCH_DATA_SUCCESS',
        items
    };
}

export function itemsFetchData(url:string) {
    return (dispatch:any) => {
        dispatch(itemsAreLoading(true));

        axios.get(url)
            .then((response:any) => {
                if (response.status !== 200) {
                    throw Error(response.statusText);
                }

                dispatch(itemsAreLoading(false));

                return response;
            })
            .then((response:any) => dispatch(itemsFetchDataSuccess(response.data)))
            .catch(() => dispatch(itemsHaveError(true)));
    };
}

export function getExchangeData(){
    return  async (dispatch:any) => {
        try {
            const response = await fetch('https://api.exchangeratesapi.io/latest');
            const data = await response.json();
            dispatch(itemsFetchDataSuccess(data));

            return response;
        } catch (error) {
            dispatch(itemsFetchDataSuccess([]));
            return []
        }     
    }
}

