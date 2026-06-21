import { QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { initFavouritesDb } from '../services/favouritesDb';
import { queryClient } from '../services/queryClient';
import { loadFavouritesFromDb } from '../store/favouritesSlice';
import { store } from '../store';

interface AppProvidersProps {
  children: ReactNode;
}

function FavouritesBootstrap() {
  useEffect(() => {
    initFavouritesDb();
    store.dispatch(loadFavouritesFromDb());
  }, []);

  return null;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <FavouritesBootstrap />
        {children}
      </QueryClientProvider>
    </Provider>
  );
}
