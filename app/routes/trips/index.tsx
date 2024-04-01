import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { requireUserId } from "#app/utils/auth.server";
import { prisma } from "#app/utils/db.server";
import { Link, useLoaderData } from '@remix-run/react';

export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await requireUserId(request)
	const owner = await prisma.user.findFirst({
		select: {
			id: true,
			name: true,
			username: true,
			image: { select: { id: true } },
			trips: { select: { id: true, title: true } },
		},
		where: { id: userId },
	})

	invariantResponse(owner, 'Owner not found', { status: 404 })

	return json({ owner })
}

export default function TripsRoute() {
    const data = useLoaderData<typeof loader>();
    return (
        <main className="container flex h-full min-h-[400px] px-0 pb-12 md:px-8">
            <p>All of your trips should show here</p>
            <ul className="overflow-y-auto overflow-x-hidden pb-12">                
                {data.owner.trips.map(trip => (
                    <li key={trip.id} className="p-1 pr-0">
                        <Link
                            to={trip.id}
                            preventScrollReset
                            prefetch="intent"                            
                        >
                            {trip.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
        
    )
}