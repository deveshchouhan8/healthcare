import { render, screen, waitFor } from "@testing-library/react";
import Header from "./Header";

jest.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
}));

describe("Header Component", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({
        success: false,
        message: "Please login first.",
      }),
    }) as jest.Mock;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders the MediCare logo", async () => {
    render(<Header />);

    expect(
      screen.getByText("MediCare", { exact: false })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  test("shows Login and Register when logged out", async () => {
    render(<Header />);

    expect(
      await screen.findByRole("link", { name: "Login" })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", { name: "Register" })
    ).toBeInTheDocument();
  });
});

