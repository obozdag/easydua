// $version     = 'v1.3.37';
var version
var staticContentToCache = [
	'app.js',
	'css/easy_dua.css',
	'css/fonts.css',
	'css/fonts/EasyArabic.ttf',
	'css/fonts/Lateef.ttf',
	'css/fonts/rb.ttf',
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
	'duas/ashabi_bedir.html',
	'duas/dualar.html',
	'duas/ismi_azam.html',
	'duas/munacati_veysel_karani.html',
	'duas/sekine.html',
	'duas/suhedai_uhud.html',
	'duas/tefriciye.html',
	'duas/tercumani_ismi_azam.html',
	'favicon.ico',
	'images/flower.png',
	'images/lavender.png',
	'images/liltree.png',
	'index.php',
	'js/easy_dua.js',
	'js/lang.js',
	'js/settings.js',
	'js/swipe.js',
	'languages/en/program_info.php',
	'languages/tr/program_info.php',
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
