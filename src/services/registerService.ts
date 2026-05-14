import { supabase } from "@/api/supabaseClient";
import type { RegisterFormData } from "@/schemes/register";

export const registerUser = async ({
	email,
	password,
	name_organization,
	full_name,
	phone,
}: RegisterFormData) => {
	const { data, error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				organization_name: name_organization,
				full_name,
				phone,
			},
		},
	});

	if (error) throw error;
	if (!data.user) throw new Error("No se pudo crear el usuario");

	return data.user;
};
