import { QueryClient } from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import {
  persistQueryClient,
  removeOldestQuery,
  type PersistedClient,
} from "@tanstack/react-query-persist-client";

export type PersistRetryer = (props: {
  persistedClient: PersistedClient;
  error: Error;
  errorCount: number;
}) => PersistedClient | undefined;

const dpdQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // gcTime: 1000 * 60 * 60 * 24, // 24 hours
      gcTime: Infinity,
      staleTime: Infinity,
    },
  },
});

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  retry: removeOldestQuery,
});
// const sessionStoragePersister = createSyncStoragePersister({ storage: window.sessionStorage })

persistQueryClient({
  queryClient: dpdQueryClient,
  persister: localStoragePersister,
});

export default dpdQueryClient;
