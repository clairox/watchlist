import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { LoginPage } from "./LoginPage";

test("if both email and password is entered, login button is enabled", async () => {
	render(
		<MemoryRouter>
			<LoginPage />
		</MemoryRouter>
	);

	expect(
		await screen.findByRole("button", { name: /login/i })
	).toBeDisabled();

	userEvent.type(screen.getByPlaceholderText(/email/i), "a");
	userEvent.type(screen.getByPlaceholderText(/password/i), "a");

	expect(await screen.findByRole("button", { name: /login/i })).toBeEnabled();
});
