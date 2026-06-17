import z from 'zod';

export const CategoryFormSchema = z.object({
	name: z.string().min(1, 'Insira um nome valido').max(100, 'O nome deve ter no máximo 100 caracteres'),
	type: z.string().min(1, 'Selecione o tipo'),
	color: z
		.string()
		.transform((color) => color.toUpperCase())
		.pipe(z.string().regex(/^#[0-9A-F]{6}$/, 'Selecione uma cor valida')),
});

export type CategoryFormData = z.infer<typeof CategoryFormSchema>;
