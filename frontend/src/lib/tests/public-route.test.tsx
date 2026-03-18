import { screen } from "@testing-library/react";
import { Mock, vi } from "vitest";
import { renderWithProviders } from "@/tests/setup";
import { AuthProvider, PublicRoute } from "@/lib/auth";

// Mock loader
vi.mock("@/components/FullScreenLoader", () => ({
  default: () => <div data-testid="loader">Loading...</div>,
}));

describe("PublicRoute", () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });
  it("shows children when user is not authenticated", () => {
      renderWithProviders(
        <AuthProvider>
          <PublicRoute>
            <div>Public Content</div>
          </PublicRoute>
        </AuthProvider>
      );
      screen.debug();
      expect(screen.getByText("Public Content")).toBeInTheDocument();
    });  
});