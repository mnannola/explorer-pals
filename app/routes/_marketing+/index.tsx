import { type MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'

export const meta: MetaFunction = () => [{ title: 'Explorer Pals' }]

export default function Index() {
	return (
		<main className="m-4">
			<Link to="/trips">View your Trips</Link>

		</main>
	)
}