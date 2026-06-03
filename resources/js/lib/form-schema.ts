import * as z from "zod"

export interface ActionResponse<T = any> {
    success: boolean
    message: string
    errors?: {
        [K in keyof T]?: string[]
    }
    inputs?: T
}
export const formSchema = z.object({
    "firstName": z.string({ error: 'This field is required' }),
    "lastName": z.string({ error: 'This field is required' }),
    "email": z.email({ error: 'Please enter a valid email' }),
    "github-url": z.url({ error: 'Please enter a valid url' }).optional(),
    "linkedin-url": z.url({ error: 'Please enter a valid url' }).optional(),
    "position": z
        .array(z.string(), { error: 'Please select at least one item' })
        .min(1, 'Please select at least one item'),
    "experience": z.string().min(1, 'Please select an item'),
    "available-date": z.string().min(1, 'Please select an item'),
    "cover-letter": z.string({ error: 'This field is required' }).optional(),
    "file-upload": z.union([
        z.file()
            .mime(["application/pdf", "application/doc", "application/docx"])
            .max(undefined),
        z.array(
            z.file()
                .mime(["application/pdf", "application/doc", "application/docx"])
                .max(undefined)
        ).nonempty({ message: "Please select a file" }),
        z.string().min(1, "Please select a file"),
        z.instanceof(FileList),
    ]).optional()
});
