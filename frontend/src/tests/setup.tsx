// tests/setup.tsx
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";
import { ReactNode } from "react";
import "@testing-library/jest-dom";

export const createTestQueryClient = () => new QueryClient({
    defaultOptions: { 
        queries: { retry: false, gcTime: 0 } 
    }
});

interface RenderOptions {
    initialRoute?: string;
    queryClient?: QueryClient;
}

export const renderWithProviders = (
    ui: ReactNode, 
    { initialRoute = "/", queryClient = createTestQueryClient() }: RenderOptions = {}
) => {
    return {
        ...render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[initialRoute]}>
                    {ui}
                </MemoryRouter>
            </QueryClientProvider>
        ),
        queryClient,
    };
};