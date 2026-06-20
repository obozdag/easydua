if ('serviceWorker' in navigator)
{
	const version = window.appConfig?.version ?? String(Date.now());
	const reloadGuardKey = `easy-dua-sw-reloaded-${version}`;
	let refreshing = false;

	function getUpdateBannerElements()
	{
		return {
			banner: document.getElementById('update_banner'),
		};
	}

	function showUpdateBanner(worker)
	{
		const { banner } = getUpdateBannerElements();

		if (!banner) {
			return;
		}

		banner.hidden = false;

		if (worker) {
			worker.postMessage({ type: 'SKIP_WAITING' });
		}
	}

	function trackInstallingWorker(worker)
	{
		if (!worker) {
			return;
		}

		worker.addEventListener('statechange', () => {
			if (worker.state === 'installed' && navigator.serviceWorker.controller) {
				showUpdateBanner(worker);
			}
		});
	}

	navigator.serviceWorker.addEventListener('controllerchange', () => {
		if (refreshing) {
			return;
		}

		refreshing = true;

		if (window.sessionStorage.getItem(reloadGuardKey) === '1') {
			return;
		}

		window.sessionStorage.setItem(reloadGuardKey, '1');
		window.location.reload();
	});

	function registerServiceWorker()
	{
		navigator.serviceWorker.register(`/sw.js?v=${encodeURIComponent(version)}`).then(registration => {
			console.log('serviceWorker registered. Scope: ', registration.scope);

			registration.update().catch(error => {
				console.log('serviceWorker startup update check failed', error);
			});

			if (registration.waiting) {
				showUpdateBanner(registration.waiting);
			}

			trackInstallingWorker(registration.installing);

			registration.addEventListener('updatefound', () => {
				trackInstallingWorker(registration.installing);
			});

			window.setInterval(() => {
				registration.update().catch(error => {
					console.log('serviceWorker update check failed', error);
				});
			}, 60 * 60 * 1000);
		}).catch(error => {
			console.warn('serviceWorker not registered', error);
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', registerServiceWorker, { once: true });
	} else {
		registerServiceWorker();
	}
}
