import { type MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { Button } from '#app/components/ui/button.js'
import { Icon } from '#app/components/ui/icon.js'

export const meta: MetaFunction = () => [{ title: 'Explorer Pals' }]

export default function Index() {
	return (
		<main className="container mx-auto py-8">
			<div className="my-3">
				<Button asChild>
					<Link to="/trips">View your Trips</Link>
				</Button>			
			</div>
			
			<div>
				<Button variant="secondary" asChild>
					<a href="https://expedia.com/affiliate/3yRyX67">
						Go to Expedia! <Icon name="exit"></Icon></a>
				</Button>
			</div>
			
							
		</main>
	)
}