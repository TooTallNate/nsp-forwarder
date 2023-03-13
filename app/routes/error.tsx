import { useLoaderData } from '@remix-run/react';
import { json, LoaderArgs } from '@vercel/remix';

import { getSession, commitSession } from '~/session.server';

export const config = { runtime: 'edge' };

export async function loader({ request }: LoaderArgs) {
	const session = await getSession(request.headers.get('Cookie'));
	const error = session.get('error');
	return json(
		{ error },
		{
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		}
	);
}

export default function ErrorPage() {
	const data = useLoaderData();
	return (
		<pre>
			Error while generating
			<code>{JSON.stringify(data, null, 2)}</code>
		</pre>
	);
}
