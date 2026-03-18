import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUser, loginInputSchema, loginWithUsernameAndPassword, refreshToken } from "@/lib/auth";
import { api } from "@/lib/api/api";
 import { renderHook, waitFor } from "@testing-library/react";
import { useLoginWithUsernameAndPassword } from "@/lib/auth";
import * as authApi from "@/lib/auth"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, useNavigate } from "react-router";

vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router");
    return { ...actual, useNavigate: vi.fn() };
});

vi.mock("@/lib/api/api", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/api/api")>();
  return {
    ...actual, 
    apiLogout: vi.fn(), 
    api: {
      get: vi.fn(),
      post: vi.fn(),
    },
    };
});

describe("Auth API Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUser", () => {
    it("returns user data when API call succeeds", async () => {
      const mockUser = { id: "1", username: "test" };
      vi.mocked(api.get).mockResolvedValue(mockUser);

      const result = await getUser();

      expect(api.get).toHaveBeenCalledWith("/users/");
      expect(result).toEqual(mockUser);
    });

    it("returns null when API call fails", async () => {
      vi.mocked(api.get).mockRejectedValue(new Error("Unauthorized"));
      const result = await getUser();
      expect(result).toBeNull();
    });
  });

  describe("refreshToken", () => {
    it("calls refresh endpoint without Auth headers", async () => {
      vi.mocked(api.post).mockResolvedValue({ access: "new-token" });
      
      await refreshToken();

      expect(api.post).toHaveBeenCalledWith("/token/refresh/", null, {
        headers: { Authorization: undefined },
      });
    });
  });

  describe("loginWithUsernameAndPassword", () => {
    it("returns auth data on success", async () => {
      const input = { username: "test", password: "123" };
      const mockResponse = { access: "token", refresh: "refresh" };
      vi.mocked(api.post).mockResolvedValue(mockResponse);

      const result = await loginWithUsernameAndPassword(input);

      expect(api.post).toHaveBeenCalledWith("/token/", input);
      expect(result).toEqual(mockResponse);
    });

    it("throws error when login fails", async () => {
      vi.mocked(api.post).mockRejectedValue(new Error("Invalid Credentials"));
      await expect(loginWithUsernameAndPassword({ username: "a", password: "b" }))
        .rejects.toThrow("Invalid Credentials");
    });
    });
describe("useLoginWithUsernameAndPassword", () => {
    const queryClient = new QueryClient();
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);
        queryClient.clear();
        sessionStorage.clear();
        vi.clearAllMocks();
    });

    it("saves token and navigates to /home on success", async () => {
        const loginSpy = vi.spyOn(api, "post").mockResolvedValue({
        access: "fake-access-token",
        });
        
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>{children}</MemoryRouter>
            </QueryClientProvider>
        );

        const { result } = renderHook(() => useLoginWithUsernameAndPassword(), { wrapper });

       await result.current.mutateAsync({
            username: "testuser",
            password: "password123",
            });

        await waitFor(() => {
            // Verify SessionStorage
            expect(sessionStorage.getItem("accessToken")).toBe("fake-access-token");
            
            // Verify Cache Invalidation
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["currentUser"] });
            expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["applications"] });
            
            // Verify Navigation
            expect(mockNavigate).toHaveBeenCalledWith("/home");
        });
    });
});
  });
  describe("loginInputSchema", () => {
    it("validates correct input", () => {
      const validInput = { username: "user", password: "pass" };
      expect(() => loginInputSchema.parse(validInput)).not.toThrow();
    });
});

import { act } from "react"; 
import { useAuth, AuthProvider } from "@/lib/auth";
import * as apiModule from "@/lib/api/api";

describe("Auth Logout", () => {
  it("performs full cleanup of storage and cache", async () => {
    const queryClient = new QueryClient();
    
    const apiLogoutSpy = vi.spyOn(apiModule, "apiLogout").mockResolvedValue(undefined);
    const getUserSpy = vi.spyOn(authApi, "getUser").mockResolvedValue({ 
        id: "1", 
        username: "test", 
        email: "test@example.com", 
        first_name: "Test", 
        last_name: "User" 
    });

    sessionStorage.setItem("accessToken", "active-session");

    const { result } = renderHook(() => useAuth(), {
        wrapper: ({ children }) => (
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </MemoryRouter>
            </QueryClientProvider>
        ),
    });

    await waitFor(() => {
        expect(result.current).not.toBeNull();
    });

    await act(async () => {
        await result.current.logout();
    });

    expect(sessionStorage.getItem("accessToken")).toBeNull();
    expect(apiLogoutSpy).toHaveBeenCalled();
});
});