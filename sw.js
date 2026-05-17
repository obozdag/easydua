const CACHE_NAME = 'easy-dua-v1.3.39';

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
	'dua.php?slug=ashabi_bedir',
	'dua.php?slug=dualar',
	'dua.php?slug=ismi_azam',
	'dua.php?slug=munacati_veysel_karani',
	'dua.php?slug=sekine',
	'dua.php?slug=suhedai_uhud',
	'dua.php?slug=tefriciye',
	'dua.php?slug=tercumani_ismi_azam',
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
	'languages/en/program_info.php',
	'languages/tr/program_info.php',
];

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then(cache => Promise.all(
				staticContentToCache.map(file => {
					return cache.add(file).catch(error => {
						console.error(`Failed to cache ${file}`, error);
					});
				}),
			))
			.then(() => self.skipWaiting()),
	);
});

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys()
			.then(keys => Promise.all(
				keys
					.filter(key => key !== CACHE_NAME)
					.map(key => caches.delete(key)),
			))
			.then(() => self.clients.claim()),
	);
});

self.addEventListener('fetch', event => {
	if (event.request.method !== 'GET') {
		return;
	}

	event.respondWith(
		caches.match(event.request).then(cacheResponse => {
			if (cacheResponse) {
				return cacheResponse;
			}

			return fetch(event.request).catch(() => {
				if (event.request.mode === 'navigate') {
					return caches.match('index.php');
				}

				return new Response('', {
					status: 503,
					statusText: 'Offline',
				});
			});
		}),
	);
});
