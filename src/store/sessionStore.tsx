import { createStore } from "redux";
import { User } from "../user/userApi";

export interface StoredState {
    token?: string;
    user?: User;
}

enum StoreAction {
    UPDATE, CLEANUP,
}

interface Action {
    type: StoreAction;
    payload?: StoredState;
}

export const sessionStore = createStore((state: StoredState = {}, action: Action) => {
    switch (action.type) {
        case StoreAction.UPDATE:
            return {
                ...state,
                ...action.payload,
            };
        case StoreAction.CLEANUP:
            return {
                ...state,
                token: undefined,
                user: undefined,
            };
        default:
            return state;
    }
});

export function updateStoreToken(token: string) {
    sessionStore.dispatch({
        payload: {
            token
        },
        type: StoreAction.UPDATE,
    });
}

export function updateStoreUser(user: User) {
    sessionStore.dispatch({
        payload: {
            user
        },
        type: StoreAction.UPDATE,
    });
}

export function cleanupStore() {
    sessionStore.dispatch({
        payload: undefined,
        type: StoreAction.CLEANUP,
    });
}
