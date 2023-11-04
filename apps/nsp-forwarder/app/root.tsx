import { LinksFunction, MetaFunction } from '@vercel/remix';
import {
	Link,
	Links,
	LiveReload,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
	useLocation,
} from '@remix-run/react';
import { Analytics } from '@vercel/analytics/react';

import { Header } from '~/components/header';

import radixWhiteA from '@radix-ui/colors/white-alpha.css';
import radixBlackA from '@radix-ui/colors/black-alpha.css';
import radixMauve from '@radix-ui/colors/mauve-dark.css';
import radixViolet from '@radix-ui/colors/violet-dark.css';
import rootStyles from '~/styles/root.css';
import headerStyles from '~/styles/header.css';
import footerStyles from '~/styles/footer.css';
import { Vercel } from '~/components/vercel';
import { GitHubLogoIcon } from '@radix-ui/react-icons';

export const config = { runtime: 'edge' };

export const meta: MetaFunction = () => {
	return [
		{ charset: 'utf-8' },
		{ title: 'NSP Forwarder Generator' },
		{
			name: 'description',
			content:
				'Create "NRO to NSP forwarders" for your modded Nintendo Switch.',
		},
		{
			name: 'viewport',
			content: 'width=device-width,initial-scale=1',
		},
	];
};

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: radixWhiteA },
		{ rel: 'stylesheet', href: radixBlackA },
		{ rel: 'stylesheet', href: radixMauve },
		{ rel: 'stylesheet', href: radixViolet },
		{ rel: 'stylesheet', href: rootStyles },
		{ rel: 'stylesheet', href: headerStyles },
		{ rel: 'stylesheet', href: footerStyles },
	];
};

export default function App() {
	const { pathname } = useLocation();
	return (
		<html lang="en" className="dark-theme">
			<head>
				<Meta />
				<link
					rel="canonical"
					href={`https://nsp-forwarder.n8.io${pathname}`}
				/>
				<Links />
			</head>
			<body>
				<div className="bg"></div>
				<div className="bg-fade"></div>
				<header>
					<Link to="/" className="header">
						<Header as="h2">NSP Forwarder</Header>
						<Header as="h1">Generator</Header>
					</Link>
				</header>
				<div className="content">
					<Outlet />
				</div>
				<div className="footer">
					<span className="source">
						<a
							target="_blank"
							href="https://github.com/TooTallNate/switch-tools/tree/main/apps/nsp-forwarder"
						>
							Source Code
							<GitHubLogoIcon />
						</a>
					</span>
					<span>
						<a target="_blank" href="https://vercel.com">
							Hosted by <Vercel />
						</a>
					</span>
				</div>
				<ScrollRestoration />
				<Scripts />
				<LiveReload />
				<Analytics />
			</body>
		</html>
	);
}
