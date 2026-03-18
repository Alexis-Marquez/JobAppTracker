import { screen } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { ProtectedRoute } from "@/lib/protected-route";
import * as authHooks from "@/lib/auth";
import { Routes, Route } from "react-router";
import { renderWithProviders } from "@/tests/setup";

// Mock loader
vi.mock("@/components/FullScreenLoader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

// Mock useAuth hook
vi.mock("@/lib/auth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/auth")>();
  return {
    ...actual,
    useAuth: vi.fn(),
  };
});

describe("ProtectedRoute", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it("shows loader when token exists but user is still loading", () => {
    sessionStorage.setItem("accessToken", "fake-token");

    (authHooks.useAuth as Mock).mockReturnValue({
      user: null,
      isLoading: true,
      logout: vi.fn(),
    });

    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    screen.debug();
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("redirects to '/' when there is no user", () => {
    (authHooks.useAuth as Mock).mockReturnValue({
      user: null,
      isLoading: false,
      logout: vi.fn(),
    });

    renderWithProviders(
      <Routes>
        <Route path="/" element={<div>Login Page</div>} />
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    );

    window.history.pushState({}, "", "/protected");

    screen.debug();

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(
      screen.queryByText("Protected Content")
    ).not.toBeInTheDocument();
  });

  it("renders children when user is authenticated", () => {
    (authHooks.useAuth as Mock).mockReturnValue({
      user: {
        id: "1",
        username: "testuser",
        email: "testuser@example.com",
        first_name: "Test",
        last_name: "User",
      },
      isLoading: false,
      logout: vi.fn(),
    });

    renderWithProviders(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    );
    screen.debug();
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });
});