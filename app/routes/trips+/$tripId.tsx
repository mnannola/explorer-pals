import { invariantResponse } from "@epic-web/invariant";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { formatDistanceToNow } from "date-fns";
import { prisma } from "#app/utils/db.server";
import { useLoaderData } from "@remix-run/react";

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

export default function TripRoute() {
    const data = useLoaderData<typeof loader>()
    // const user = useOptionalUser()

    return (
        <main className="container mx-auto py-8">   
            <h2>{data.trip.title}</h2>
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