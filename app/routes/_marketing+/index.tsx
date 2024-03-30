import { type MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => [{ title: 'Explorer Pals' }]

export default function Index() {
	return (
		<main className="m-4">
			<p>Amazing marketing copy coming soon!</p>
		</main>
	)
}