var cacheName = 'dua-v1.1';
var staticContentToCache = [
	'index.html',
	'favicon.ico',
	'css/dua.css',
	'css/fonts/hamdullah.ttf',
	'css/fonts/lateef.ttf',
	'css/fonts/rb_icons.ttf',
	'css/icons/dua_32x32.png',
	'css/icons/dua_48x48.png',
	'css/icons/dua_64x64.png',
	'css/icons/dua_72x72.png',
	'css/icons/dua_96x96.png',
	'css/icons/dua_128x128.png',
	'css/icons/dua_144x144.png',
	'css/icons/dua_152x152.png',
	'css/icons/dua_192x192.png',
	'css/icons/dua_384x384.png',
	'css/icons/dua_512x512.png',
	'css/icons/dua_loading.gif',
	'app.js',
	'js/swipe.js',
	'js/lang.js',
	'js/settings.js',
	'js/dua.js',
	'languages/en/program_info.html',
	'languages/tr/program_info.html',
];

// Installing Service Worker
self.addEventListener('install', evt => {
	console.log('Service worker installed.');
	evt.waitUntil(
		caches.open(cacheName).then(cache => {
			staticContentToCache.forEach(function(file){
				cache.add(file).catch((err)=>{
					console.error(err)
				})
			});
		})
	);
});

// Fetching content using Service Worker
self.addEventListener('fetch', evt => {
	evt.respondWith(
		caches.match(evt.request).then(
			cacheResponse => {
				return cacheResponse || fetch(evt.request);
		}));
});
