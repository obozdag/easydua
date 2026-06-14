if ('serviceWorker' in navigator)
{
	const version = window.appConfig?.version ?? '1.5.4';
	let refreshing = false;

	function getUpdateBannerElements()
	{
		return {
			banner: document.getElementById('update_banner'),
			reloadButton: document.getElementById('update_banner_reload'),
		};
	}

	function showUpdateBanner(worker)
	{
		const { banner, reloadButton } = getUpdateBannerElements();

		if (!banner || !reloadButton) {
			return;
		}

		banner.hidden = false;
		reloadButton.onclick = () => {
			worker.postMessage({ type: 'SKIP_WAITING' });
		};
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
		window.location.reload();
	});

	function registerServiceWorker()
	{
		navigator.serviceWorker.register(`/sw.js?v=${encodeURIComponent(version)}`).then(registration => {
			console.log('serviceWorker registered. Scope: ', registration.scope);

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
		}).catch(err => {
			console.log('serviceWorker not registered', err);
		});
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', registerServiceWorker, { once: true });
	} else {
		registerServiceWorker();
	}
}
