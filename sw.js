var cacheName = 'EasyDua v1.3.33';
var staticContentToCache = [
	'/',
	'index.php',
	'favicon.ico',
	'css/fonts.css',
	'css/rb.css',
	'css/easy_dua.css',
	'css/fonts/EasyArabic.ttf',
	'css/fonts/Lateef.ttf',
	'css/fonts/rb.ttf',
	'css/icons/easy_dua_32x32.png',
	'css/icons/easy_dua_48x48.png',
	'css/icons/easy_dua_64x64.png',
	'css/icons/easy_dua_72x72.png',
	'css/icons/easy_dua_96x96.png',
	'css/icons/easy_dua_128x128.png',
	'css/icons/easy_dua_144x144.png',
	'css/icons/easy_dua_152x152.png',
	'css/icons/easy_dua_192x192.png',
	'css/icons/easy_dua_384x384.png',
	'css/icons/easy_dua_512x512.png',
	'css/icons/loading.gif',
	'app.js',
	'js/swipe.js',
	'js/lang.js',
	'js/settings.js',
	'js/easy_dua.js',
	'languages/en/program_info.html',
	'languages/tr/program_info.html',
	'duas/ismi_azam.html',
	'duas/tercumani_ismi_azam.html',
	'duas/munacati_veysel_karani.html',
	'duas/sekine.html',
	'duas/tefriciye.html',
	'duas/ashabi_bedir.html',
	'duas/dualar.html',
	'duas/suhedai_uhud.html',
	'images/flower.png',
	'images/lavender.png',
	'images/liltree.png',
];

// Installing Service Worker
self.addEventListener('install', evt => {
	evt.waitUntil(
		caches.open(cacheName).then(cache => {
			return staticContentToCache.forEach(function(file){
				cache.add(file).catch(err => console.log(err+file))
			})
		})
		.then(function(){return self.skipWaiting()})
	)})

// Activating Service Worker
self.addEventListener('activate', evt => {
	evt.waitUntil(
		caches.keys().then(keys => {
			return Promise.all(keys
				.filter(key => key !== cacheName)
				.map(key => caches.delete(key))
			)
	}))})


// Fetching content using Service Worker
self.addEventListener('fetch', evt => {
	evt.respondWith(
		caches.match(evt.request).then(
			cacheResponse => {
				return cacheResponse || fetch(evt.request);
		}))
	})
