import { describe, test, expect, mock, beforeEach } from "bun:test";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginForm from "@/auth/presentation/loginForm.presentation";
import { encode } from "@/shared/utils";

// Must be mocked before imports that use sileo (AppContext imports Toaster from sileo)
mock.module("sileo", () => ({
    sileo: {
        success: mock(() => {}),
        error: mock(() => {}),
    },
    Toaster: () => null,
}));

function createTestRouter() {
    return createMemoryRouter(
        [
            { path: "/login", element: <LoginForm /> },
            { path: "/", element: <div>Dashboard</div> },
        ],
        { initialEntries: ["/login"] }
    );
}

function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            mutations: { retry: 0 },
            queries: { retry: 0 },
        },
    });
}

function renderLoginForm() {
    const router = createTestRouter();
    render(
        <QueryClientProvider client={createQueryClient()}>
            <RouterProvider router={router} />
        </QueryClientProvider>
    );
    return router;
}

describe("LoginForm", () => {
    beforeEach(() => {
        (global.fetch as unknown) = mock(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ message: "Login successful" }),
            } as Response)
        );
    });

    test("renders username and password inputs", () => {
        renderLoginForm();

        expect(screen.getByPlaceholderText("Username")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    test("submits with encoded password for user diego/1234", async () => {
        renderLoginForm();

        fireEvent.change(screen.getByPlaceholderText("Username"), {
            target: { value: "diego" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "1234" },
        });
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith(
                "/auth/login",
                expect.objectContaining({
                    method: "POST",
                    body: JSON.stringify({
                        username: "diego",
                        password: encode("1234"),
                    }),
                })
            );
        });
    });

    test("navigates to home on successful login", async () => {
        renderLoginForm();

        fireEvent.change(screen.getByPlaceholderText("Username"), {
            target: { value: "diego" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "1234" },
        });
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText("Dashboard")).toBeInTheDocument();
        });
    });

    test("shows error toast on failed login", async () => {
        (global.fetch as unknown) = mock(() =>
            Promise.resolve({
                ok: false,
                statusText: "Unauthorized",
                json: () => Promise.resolve({ message: "Invalid credentials" }),
            } as Response)
        );

        renderLoginForm();

        fireEvent.change(screen.getByPlaceholderText("Username"), {
            target: { value: "diego" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "wrongpass" },
        });
        fireEvent.click(screen.getByRole("button", { name: /login/i }));

        const { sileo } = await import("sileo");

        await waitFor(() => {
            expect(sileo.error).toHaveBeenCalled();
        });
    });
});
