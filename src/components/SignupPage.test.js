import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { SignupPage } from "./SignupPage";

test("if all text fields are entered, signup button is enabled", async () => {
	render(
		<MemoryRouter>
			<SignupPage />
		</MemoryRouter>
	);

	expect(
		await screen.findByRole("button", { name: /sign up/i })
	).toBeDisabled();

	userEvent.type(screen.getByPlaceholderText(/first/i), "a");
	userEvent.type(screen.getByPlaceholderText(/last/i), "a");
	userEvent.type(screen.getByPlaceholderText(/email/i), "a");
	userEvent.type(screen.getByPlaceholderText(/password/i), "a");

	expect(
		await screen.findByRole("button", { name: /sign up/i })
	).toBeEnabled();
});
