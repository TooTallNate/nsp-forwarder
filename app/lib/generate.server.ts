import sharp from 'sharp';
import { join } from 'path';
import { once } from 'events';
import { tmpdir } from 'os';
import { spawn } from 'child_process';
import { mkdtemp, copy, writeFile, remove, readFile } from 'fs-extra';
import { redirect } from '@vercel/remix';

import { NACP } from '~/lib/nacp';
import { generateRandomID } from '~/lib/generate-id';
import { commitSession, getSession } from '~/session.server';

export async function generateNsp(request: Request) {
	const TEMPLATE_PATH = join(process.cwd(), 'template');
	const HACBREWPACK_PATH = join(
		process.cwd(),
		`hacbrewpack-${process.platform}`
	);

	const formData = await request.formData();
	const id = formData.get('id') || generateRandomID();
	const title = formData.get('title');
	const publisher = formData.get('publisher');
	const core = formData.get('core');
	const rom = formData.get('rom');
	const imageFile = formData.get('image');
	const imageCropX = formData.get('image-crop-x');
	const imageCropY = formData.get('image-crop-y');
	const imageCropWidth = formData.get('image-crop-width');
	const imageCropHeight = formData.get('image-crop-height');
	const keysFile = formData.get('keys');
	const cwd = await mkdtemp(join(tmpdir(), `nsp-`));
	//console.log(cwd);
	try {
		if (typeof id !== 'string') {
			throw new Error('expected "id" to be a string');
		}
		if (typeof title !== 'string') {
			throw new Error('expected "title" to be a string');
		}
		if (typeof publisher !== 'string') {
			throw new Error('expected "publisher" to be a string');
		}
		if (typeof core !== 'string') {
			throw new Error('expected "core" to be a string');
		}
		if (typeof rom !== 'string') {
			throw new Error('expected "rom" to be a string');
		}
		if (typeof imageCropX !== 'string') {
			throw new Error('expected "imageCropX" to be a string');
		}
		if (typeof imageCropY !== 'string') {
			throw new Error('expected "imageCropY" to be a string');
		}
		if (typeof imageCropWidth !== 'string') {
			throw new Error('expected "imageCropWidth" to be a string');
		}
		if (typeof imageCropHeight !== 'string') {
			throw new Error('expected "imageCropHeight" to be a string');
		}
		if (!imageFile || typeof imageFile === 'string') {
			throw new Error('expected "image" to be a File');
		}
		if (!keysFile || typeof keysFile === 'string') {
			throw new Error('expected "keys" to be a File');
		}

		const nacp = new NACP();
		nacp.id = id;
		nacp.title = title;
		nacp.author = publisher;
		nacp.version = '1.2.3';
		nacp.startupUserAccount = 0;
		nacp.logoHandling = 0;

		const [imageBuffer] = await Promise.all([
			imageFile.arrayBuffer(),
			copy(TEMPLATE_PATH, cwd),
		]);

		await Promise.all([
			writeFile(
				join(cwd, 'keys.dat'),
				Buffer.from(await keysFile.arrayBuffer())
			),
			writeFile(
				join(cwd, 'control/control.nacp'),
				Buffer.from(nacp.buffer)
			),
			writeFile(join(cwd, 'romfs/nextNroPath'), `sdmc:${core}`),
			writeFile(
				join(cwd, 'romfs/nextArgv'),
				`sdmc:${core} "sdmc:${rom}"`
			),
			sharp(Buffer.from(imageBuffer))
				.jpeg({ quality: 100, chromaSubsampling: '4:2:0' })
				.extract({
					left: parseInt(imageCropX, 10),
					top: parseInt(imageCropY, 10),
					width: parseInt(imageCropWidth, 10),
					height: parseInt(imageCropHeight, 10),
				})
				.resize(256, 256)
				.toFile(join(cwd, 'control/icon_AmericanEnglish.dat')),
		]);

		const proc = spawn(
			HACBREWPACK_PATH,
			['--nopatchnacplogo', '--titleid', id],
			{ cwd }
		);
		proc.stderr.pipe(process.stdout, { end: false });
		proc.stdout.pipe(process.stdout, { end: false });
		await once(proc, 'close');
		console.log('Exit code:', proc.exitCode);
		if (proc.exitCode !== 0) {
			throw new Error(`Got exit code ${proc.exitCode}`);
		}

		const data = await readFile(join(cwd, `hacbrewpack_nsp/${id}.nsp`));
		await remove(cwd);

		return new Response(data, {
			headers: {
				'Content-Disposition': `attachment; filename="${title} [${id}].nsp"`,
			},
		});
	} catch (err: any) {
		await remove(cwd);
		const session = await getSession(request.headers.get('Cookie'));
		session.flash('error', err.message);
		return redirect('/error', {
			headers: {
				'Set-Cookie': await commitSession(session),
			},
		});
	}
}
