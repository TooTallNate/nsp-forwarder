import { fileURLToPath } from 'node:url';
import { app, net, protocol, ipcMain, BrowserWindow } from 'electron';
import { createRequestHandler } from "@remix-run/server-runtime";
import * as build from "../build/server/index.js";

function handleSetSize(event, size) {
	const webContents = event.sender
	const win = BrowserWindow.fromWebContents(webContents)
	win.setSize(win.getSize()[0], size.height + 80);
	win.center();
	win.show();
}

function createStaticFileHandler(root) {
	let rootStr = String(root);
	if (!rootStr.endsWith('/')) rootStr += '/';
	return async (req) => {
		const { pathname } = new URL(req.url);
		const file = new URL(pathname.slice(1), rootStr);
		try {
			return await net.fetch(file);
		} catch {
			// Ignore error, should be "FILE_NOT_FOUND"
		}
	};
}

app.whenReady().then(async () => {
	ipcMain.on('set-size', handleSetSize);

	const staticHandler = createStaticFileHandler(
		new URL('../build/client', import.meta.url)
	);
	const requestHandler = createRequestHandler(build);

	protocol.handle('http', async (req) => {
		let res = await staticHandler(req);
		if (!res) res = await requestHandler(req);
		return res;
	});

	const win = new BrowserWindow({
		show: false,
		autoHideMenuBar: true,
		webPreferences: {
			preload: fileURLToPath(new URL('./preload.js', import.meta.url)),
		},
	});
	await win.loadURL('http://localhost/');
	// wait for the "set-size" IPC call before showing the window
}).catch(err => {
	console.error(err);
	process.exit(1);
});
