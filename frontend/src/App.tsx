import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from 'react-router-dom';
import router from '@/router';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import '@/index.css';
import AppContext from '@/core/AppContext';
import { TooltipProvider } from '@/components/ui/tooltip';

const elem = document.getElementById("root")!;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
const app = (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppContext>
        <TooltipProvider>
          <Suspense>
            <RouterProvider router={router} />
          </Suspense>
        </TooltipProvider>
      </AppContext>
    </QueryClientProvider>
  </StrictMode>
);

if (import.meta.hot) {
  // With hot module reloading, `import.meta.hot.data` is persisted.
  const root = (import.meta.hot.data.root ??= createRoot(elem));
  root.render(app);
} else {
  // The hot module reloading API is not available in production.
  createRoot(elem).render(app);
}