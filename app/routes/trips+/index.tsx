import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData } from '@remix-run/react';
import { Button } from '#app/components/ui/button.js';
import { requireUserId } from "#app/utils/auth.server";
import { prisma } from "#app/utils/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
    const userId = await requireUserId(request)
	const owner = await prisma.user.findFirst({
		select: {
			id: true,
			name: true,
			username: true,
			image: { select: { id: true } },
			trips: { select: {
                id: true,
                title: true,
                description: true,                
            } },
		},
		where: { id: userId },
	})

	invariantResponse(owner, 'Owner not found', { status: 404 })

	return json({ owner })
}

export default function TripsRoute() {
    const data = useLoaderData<typeof loader>();
    return (
        <main className="container mx-auto py-8">
            <div className="my-3">
                <Button asChild><Link to="/trips/new">Create a Trip</Link></Button>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">                
                {data.owner.trips.map(trip => (
                    <Link to={trip.id} prefetch="intent" key={trip.id}>
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-[350px]">
                            <div className="px-6 py-4 text-primary">
                                <h1 className="text-xl text-primary font-bold mb-2">{trip.title}</h1>
                                <p className="text-sm text-muted-foreground">{trip.description}</p>
                            </div>
                        </div>
                    </Link>
                ))}                
             </div>
        </main>
        
    )
}