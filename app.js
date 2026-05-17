if('serviceWorker' in navigator)
{
	const version = window.appConfig?.version ?? '1.4.0';
	navigator.serviceWorker.register(`/sw.js?v=${encodeURIComponent(version)}`).then(reg => {
		console.log('serviceWorker registered. Scope: ', reg.scope);
	}).catch(err => {
		console.log('serviceWorker not registered', err);
	});
}
