const version = new URL(self.location.href).searchParams.get('v') ?? '1.5.3';
const APP_SHELL_CACHE = `easy-dua-app-shell-v${version}`;
const RUNTIME_CACHE = `easy-dua-runtime-v${version}`;

const staticContentToCache = [
	'app.js',
	'css/easy_dua.css',
	'css/fonts.css',
	'css/fonts/EasyArabic.ttf',
	'css/fonts/Lateef.ttf',
	'css/fonts/rb.woff',
	'css/icons/easy_dua_128x128.png',
	'css/icons/easy_dua_144x144.png',
	'css/icons/easy_dua_152x152.png',
	'css/icons/easy_dua_192x192.png',
	'css/icons/easy_dua_32x32.png',
	'css/icons/easy_dua_384x384.png',
	'css/icons/easy_dua_48x48.png',
	'css/icons/easy_dua_512x512.png',
	'css/icons/easy_dua_64x64.png',
	'css/icons/easy_dua_72x72.png',
	'css/icons/easy_dua_96x96.png',
	'css/icons/loading.gif',
	'css/rb.css',
	'dua.php?slug=ashabi_bedir&language=ar',
	'dua.php?slug=dualar&language=ar',
	'dua.php?slug=ismi_azam&language=ar',
	'dua.php?slug=munacati_veysel_karani&language=ar',
	'dua.php?slug=sekine&language=ar',
	'dua.php?slug=suhedai_uhud&language=ar',
	'dua.php?slug=tefriciye&language=ar',
	'dua.php?slug=tercumani_ismi_azam&language=ar',
	'favicon.ico',
	'easy_dua.json',
	'images/flower.png',
	'images/lavender.png',
	'images/liltree.png',
	'index.php',
	'js/app/data/settings.js',
	'js/app/data/translations.js',
	'js/app/main.js',
	'js/app/services/content.js',
	'js/app/services/storage.js',
	'js/app/ui.js',
	'js/swipe.js',
	'dua.php?slug=program_info&language=en',
	'dua.php?slug=program_info&language=tr',
];

function isAppShellRequest(request)
{
	if (request.mode === 'navigate') {
		return true;
	}

	const url = new URL(request.url);
	return url.origin === self.location.origin && staticContentToCache.includes(url.pathname.slice(1) + url.search);
}

function normalizeCacheKey(request)
{
	const url = new URL(request.url);
	return `${url.pathname.slice(1)}${url.search}`;
}

function isCacheableRequest(request)
{
	const url = new URL(request.url);
	return url.protocol === 'http:' || url.protocol === 'https:';
}

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(APP_SHELL_CACHE)
			.then(cache => Promise.all(
				staticContentToCache.map(file => {
					return cache.add(file).catch(error => {
						console.error(`Failed to cache ${file}`, error);
					});
				}),
			)),
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys()
			.then(keys => Promise.all(
				keys
					.filter(key => key !== APP_SHELL_CACHE && key !== RUNTIME_CACHE)
					.map(key => caches.delete(key)),
			))
			.then(() => self.clients.claim()),
	);
});

self.addEventListener('message', event => {
	if (event.data?.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

self.addEventListener('fetch', event => {
	if (event.request.method !== 'GET') {
		return;
	}

	if (!isCacheableRequest(event.request)) {
		return;
	}

	if (isAppShellRequest(event.request)) {
		event.respondWith(
			caches.open(APP_SHELL_CACHE).then(async cache => {
				const cacheKey = normalizeCacheKey(event.request);
				const cachedResponse = await cache.match(cacheKey);

				if (cachedResponse) {
					return cachedResponse;
				}

				try {
					const response = await fetch(event.request);
					cache.put(cacheKey, response.clone());
					return response;
				} catch (error) {
					if (event.request.mode === 'navigate') {
						return cache.match('index.php');
					}

					return new Response('', {
						status: 503,
						statusText: 'Offline',
					});
				}
			}),
		);
		return;
	}

	event.respondWith(
		caches.open(RUNTIME_CACHE).then(async cache => {
			try {
				const response = await fetch(event.request);
				cache.put(event.request, response.clone());
				return response;
			} catch (error) {
				const cachedResponse = await cache.match(event.request);
				if (cachedResponse) {
					return cachedResponse;
				}

				return new Response('', {
					status: 503,
					statusText: 'Offline',
				});
			}
		}),
	);
});
