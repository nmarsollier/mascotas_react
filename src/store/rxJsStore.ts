import { Subject } from "rxjs";
import { User } from "../user/userApi";
import { useState, useLayoutEffect } from "react";

export interface StoredState {
  token?: string;
  user?: User;
}

let mascotasState: StoredState = {};

const mascotasStore = new Subject<StoredState>();

export function useUserState() {
  const [user, setUser] = useState(mascotasState.user);

  useLayoutEffect(() => {
    mascotasStore.subscribe((newState) => {
      setUser(newState.user);
    });
  }, []);

  return user;
}

export function useTokenState() {
  const [token, setToken] = useState(mascotasState.token);

  useLayoutEffect(() => {
    mascotasStore.subscribe((newState) => {
      setToken(newState.token);
    });
  }, []);

  return token;
}

export function updateStoreToken(token: string) {
  mascotasState = {
    ...mascotasState,
    token,
  };
  mascotasStore.next(mascotasState);
}

export function updateStoreUser(user: User) {
  mascotasState = {
    ...mascotasState,
    user,
  };
  mascotasStore.next(mascotasState);
}

export function cleanupStore() {
  mascotasState = {};
  mascotasStore.next(mascotasState);
}
