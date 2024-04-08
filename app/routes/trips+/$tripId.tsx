import { useForm, getFormProps } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { invariantResponse } from "@epic-web/invariant";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { formatDistanceToNow } from "date-fns";
import { z } from "zod";
import { floatingToolbarClassName } from "#app/components/floating-toolbar";
import { ErrorList } from "#app/components/forms";
import { Icon } from "#app/components/ui/icon";
import { StatusButton } from "#app/components/ui/status-button";
import { requireUserId } from "#app/utils/auth.server";
import { prisma } from "#app/utils/db.server";
import { useIsPending } from "#app/utils/misc";
import { requireUserWithPermission } from "#app/utils/permissions.server";
import { redirectWithToast } from "#app/utils/toast.server";
import { useOptionalUser, userHasPermission } from "#app/utils/user";


export async function loader({ params }: LoaderFunctionArgs) {
    const trip = await prisma.trip.findUnique({
        where: { id: params.tripId },
        select: {
            id: true,
            title: true,
            description: true,
            ownerId: true,
            updatedAt: true,
            emails: {
                select: {
                    id: true,
                    address: true
                }
            }
        }
    })

    invariantResponse(trip, 'Not found', { status: 404 })

    const date = new Date(trip.updatedAt)
    const timeAgo = formatDistanceToNow(date)

    return json({
        trip,
        timeAgo
    })
}

const DeleteFormSchema = z.object({
    intent: z.literal('delete-trip'),
    tripId: z.string()
})

export async function action({request}: ActionFunctionArgs) {
    const userId = await requireUserId(request)
    const formData = await request.formData()
    const submission = parseWithZod(formData, {
        schema: DeleteFormSchema,
    })
    if (submission.status !== 'success') {
        return json(
            { result: submission.reply() },
            { status: submission.status === 'error' ? 400 : 200}
        )
    }

    const { tripId } = submission.value

    const trip = await prisma.trip.findFirst({
        select: { id: true, ownerId: true, owner: {select: { username: true} }},
        where: { id: tripId }
    })
    invariantResponse(trip, 'Not found', { status: 404})

    const isOwner = trip.ownerId === userId

    await requireUserWithPermission(
        request,
        isOwner ? `delete:trip:own` : `delete:trip:any`,
    )

    await prisma.trip.delete({ where: { id: trip.id}})

    return redirectWithToast('/trips', {
        type: 'success',
        title: 'Success',
        description: 'Your trip has been deleted.'
    })    
}

export default function TripRoute() {
    const data = useLoaderData<typeof loader>()
    const user = useOptionalUser()
    const isOwner = user?.id === data.trip.ownerId
    const canDelete = userHasPermission(
        user,
        isOwner ? `delete:trip:own` : `delete:trip:any`
    )
    const displayBar = canDelete || isOwner

    return (
        <main className="container mx-auto py-8">   
            <h2>{data.trip.title}</h2>
            <div className={`${displayBar ? 'pb-24' : 'pb-12'} overflow-y-auto`}>                
            </div>
            {displayBar ? (
                <div className={floatingToolbarClassName}>
                    <span className="text-sm text-foreground/90 max-[524px]:hidden">
                        <Icon name="clock" className="scale-125">
                            {data.timeAgo} ago
                        </Icon>
                    </span>
                    <div className="grid flex-1 grid-cols-2 justify-end gap-2 min-[525px]:flex md:gap-4">
                        {canDelete ? <DeleteTrip id={data.trip.id} /> : null}
                    </div>
                </div>
            ) : null}
            <p>{data.trip.description}</p>

            <p>Users that are on the trip:</p>
            <ul>
                {data.trip.emails.map(email => (
                    <li key={email.id}>
                        {email.address}
                    </li>
                ))}
            </ul>
        </main>
    )
}

export function DeleteTrip({ id }: { id: string }) {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	const [form] = useForm({
		id: 'delete-trip',
		lastResult: actionData?.result,
	})

	return (
		<Form method="POST" {...getFormProps(form)}>
			<input type="hidden" name="tripId" value={id} />
			<StatusButton
				type="submit"
				name="intent"
				value="delete-trip"
				variant="destructive"
				status={isPending ? 'pending' : form.status ?? 'idle'}
				disabled={isPending}
				className="w-full max-md:aspect-square max-md:px-0"
			>
				<Icon name="trash" className="scale-125 max-md:scale-150">
					<span className="max-md:hidden">Delete</span>
				</Icon>
			</StatusButton>
			<ErrorList errors={form.errors} id={form.errorId} />
		</Form>
	)
}