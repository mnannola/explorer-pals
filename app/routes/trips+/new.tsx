import { getFormProps, useForm, getInputProps } from '@conform-to/react';
import { getZodConstraint, parseWithZod } from '@conform-to/zod';
import { json, redirect, type ActionFunctionArgs } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { z } from 'zod';
import { Field } from '#app/components/forms';
import { requireUserId } from '#app/utils/auth.server';
import { prisma } from '#app/utils/db.server';

const titleMinLength = 1
const titleMaxLength = 100
const descriptionMinLength = 1
const descriptionMaxLength = 10000

const EmailsFieldsetSchema = z.object({
    id: z.string().optional(),
    address: z.string().min(1).email()
})

const TripEditorSchema = z.object({
    id: z.string().optional(),
    title: z.string().min(titleMinLength).max(titleMaxLength),
    description: z.string().min(descriptionMinLength).max(descriptionMaxLength),
    emails: z.array(EmailsFieldsetSchema).optional()
})

export async function action({ request }: ActionFunctionArgs) {
    const userId = await requireUserId(request)
    const formData = await request.formData();

    const submission = parseWithZod(formData, { schema: TripEditorSchema })

    if (submission.status !== 'success') {
        return json(submission.reply())
    }

    const {
        id: tripId,
        title,
        description
    } = submission.value

    const updatedTrip = await prisma.trip.upsert({
        select: { id: true, owner: { select: { username: true }} },
        where: { id: tripId ?? '__new_note__'},
        create: {
            ownerId: userId,
            title,
            description
        },
        update: {
            title,
            description
        }
    })

    return redirect(
        `/trips/${updatedTrip.id}`,
    )
}

export default function TripEditor() {
    const actionData = useActionData<typeof action>()
    const [form, fields] = useForm({
        id: 'trip-editor',
        constraint: getZodConstraint(TripEditorSchema),
        lastResult: actionData,
        onValidate({ formData }) {
            return parseWithZod(formData, { schema: TripEditorSchema })
        },
        shouldRevalidate: 'onBlur'
    })
    return (
        <div className="absolute inset-0">
            <Form
                method="POST"
                className="flex h-full flex-col gap-y-4 overflow-y-auto overflow-x-hidden px-10 pb-28 pt-12"
                {...getFormProps(form)}
            >
                <Field
                    labelProps={{ children: 'Title'}}
                    inputProps={{
                        autoFocus: true,
                        ...getInputProps(fields.title, { type: 'text'}),
                    }}
                    errors={fields.title.errors}
                />
                <Field
                    labelProps={{children: 'Description'}}
                    inputProps={{
                        ...getInputProps(fields.description, {type: 'text'})
                    }}
                    errors={fields.description.errors}
                />
                <button type="submit">Submit</button>
            </Form>
        </div>
        
    )
}