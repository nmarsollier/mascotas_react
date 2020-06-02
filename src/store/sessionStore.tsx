import { createStore } from "redux";
import * as userApi from "../user/userApi";
import { Login, SignUpRequest, User } from "../user/userApi";

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

const sessionStore = createStore((state: StoredState = {}, action: Action) => {
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

export async function login(payload: Login): Promise<User> {
    try {
        const data = await userApi.login(payload);
        sessionStore.dispatch({
            payload: data,
            type: StoreAction.UPDATE,
        });
        const response = await reloadCurrentUser();
        return Promise.resolve(response);
    } catch (err) {
        return Promise.reject(err);
    }
}

export async function logout(): Promise<void> {
    try {
        if (userApi.getCurrentToken() !== undefined) {
            await userApi.logout();
        }
    } finally {
        sessionStore.dispatch({
            payload: undefined,
            type: StoreAction.CLEANUP,
        });
    }
    return Promise.resolve();
}

export async function newUser(payload: SignUpRequest): Promise<User> {
    try {
        const data = await userApi.newUser(payload);
        sessionStore.dispatch({
            payload: data,
            type: StoreAction.UPDATE,
        });
        const response = await reloadCurrentUser();
        return Promise.resolve(response);
    } catch (err) {
        return Promise.reject(err);
    }
}

async function reloadCurrentUser(): Promise<User> {
    try {
        const data = await userApi.reloadCurrentUser();
        sessionStore.dispatch({
            payload: {
                user: data,
            },
            type: StoreAction.UPDATE,
        });
        return Promise.resolve(data);
    } catch (err) {
        return Promise.reject(err);
    }
}

if (userApi.getCurrentToken() !== undefined) {
    sessionStore.dispatch({
        payload: {
            token: userApi.getCurrentToken(),
            user: userApi.getCurrentUser(),
        },
        type: StoreAction.UPDATE,
    });

    reloadCurrentUser().then();
}

export default sessionStore;
