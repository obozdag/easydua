import { bgColors, colors, defaults, fontFamilies, fontSizes, languages } from './data/settings.js';
import { translations } from './data/translations.js';
import { loadText } from './services/content.js';
import { loadValue, removeValue, saveValue } from './services/storage.js';
import {
	applyLabels,
	cacheElements,
	clearBookmark,
	closePanels,
	fillSelect,
	loading,
	openTab,
	renderTabLinks,
	scrollToId,
	setBookmark,
	toggleLeftNav,
	toggleRightNav,
} from './ui.js';

const preferredLanguage = detectPreferredLanguage();

const state = {
	currentLanguage: getStoredLanguage(),
	currentTab: 'jawshan',
};

document.addEventListener('DOMContentLoaded', init);

async function init()
{
	const elements = cacheElements();
	loading(elements.loadingOverlay, false);

	if (!elements.arabic) {
		return;
	}

	initializeSelects(elements);
	await applyLanguage(elements, state.currentLanguage);
	applyAppearanceSettings(elements);
	installEventListeners(elements);
	restoreBookmark(elements);
	openTab(elements, state.currentTab);
}

function initializeSelects(elements)
{
	fillSelect(elements.fontFamilyList, fontFamilies, loadValue('fontFamily', defaults.fontFamily));
	fillSelect(elements.fontSizeList, fontSizes, loadValue('fontSize', defaults.fontSize));
	fillSelect(elements.colorList, colors, loadValue('color', defaults.color));
	fillSelect(elements.bgColorList, bgColors, loadValue('bgColor', defaults.bgColor));
	fillSelect(elements.languageList, languages, state.currentLanguage);
}

function detectPreferredLanguage()
{
	const browserLanguage = navigator.language.split(/[_-]/)[0];
	return Object.hasOwn(languages, browserLanguage) ? browserLanguage : 'en';
}

function getStoredLanguage()
{
	const storedLanguage = loadValue('language');
	return storedLanguage && Object.hasOwn(languages, storedLanguage) ? storedLanguage : preferredLanguage;
}

function getLabels(language)
{
	return translations[language] ?? translations.en;
}

async function applyLanguage(elements, language)
{
	state.currentLanguage = Object.hasOwn(languages, language) ? language : 'en';
	elements.languageList.value = state.currentLanguage;
	applyLabels(elements, getLabels(state.currentLanguage));
	renderTabLinks(elements.duaList, getLabels(state.currentLanguage).duas, tabId => {
		state.currentTab = tabId;
		openTab(elements, tabId);
	});
	saveValue('language', state.currentLanguage);
	await loadTabs(elements);
	openTab(elements, state.currentTab);
}

function applyAppearanceSettings(elements)
{
	applyCSSSetting('--set-font-family', elements.fontFamilyList.value, 'fontFamily');
	applyCSSSetting('--set-font-size', elements.fontSizeList.value, 'fontSize');
	applyCSSSetting('--set-color', elements.colorList.value, 'color');
	applyCSSSetting('--set-bg-color', elements.bgColorList.value, 'bgColor');
}

function applyCSSSetting(property, value, storageKey)
{
	document.documentElement.style.setProperty(property, value);
	saveValue(storageKey, value);
}

function installEventListeners(elements)
{
	elements.languageList.addEventListener('change', async () => {
		await applyLanguage(elements, elements.languageList.value);
	});

	for (const anchor of elements.paragraphAnchors) {
		anchor.addEventListener('click', () => addBookmark(elements, anchor.dataset.target, anchor.textContent));
	}

	elements.fontFamilyList.addEventListener('change', () => {
		applyCSSSetting('--set-font-family', elements.fontFamilyList.value, 'fontFamily');
		closePanels(elements);
	});

	elements.fontSizeList.addEventListener('change', () => {
		applyCSSSetting('--set-font-size', elements.fontSizeList.value, 'fontSize');
		closePanels(elements);
	});

	elements.colorList.addEventListener('change', () => {
		applyCSSSetting('--set-color', elements.colorList.value, 'color');
		closePanels(elements);
	});

	elements.bgColorList.addEventListener('change', () => {
		applyCSSSetting('--set-bg-color', elements.bgColorList.value, 'bgColor');
		closePanels(elements);
	});

	elements.resetBtn.addEventListener('click', () => resetSettings(elements));
	elements.paragraphNo.addEventListener('keyup', event => {
		if (event.key === 'Enter') {
			paragraphToTop(elements);
		}
	});
	elements.gotoParagraphBtn.addEventListener('click', () => paragraphToTop(elements));
	elements.topBtn.addEventListener('click', () => {
		closePanels(elements);
		scrollToId('arabic');
	});
	elements.bottomBtn.addEventListener('click', () => {
		closePanels(elements);
		scrollToId('arabic', 0, { block: 'end' });
	});
	elements.bookmarkIcon.addEventListener('click', () => removeBookmark());
	elements.programInfoBtn.addEventListener('click', async () => openInfoPopup(elements));
	elements.closePopupBtn.addEventListener('click', () => closePanels(elements));
	elements.programInfoPopup.addEventListener('click', event => {
		if (event.target === elements.programInfoPopup) {
			closePanels(elements);
		}
	});
	elements.openNavLeftBtn.addEventListener('click', () => toggleLeftNav(elements));
	elements.closeNavLeftBtn.addEventListener('click', () => elements.navLeft.classList.remove('open'));
	elements.arabic.addEventListener('swipeRight', () => toggleLeftNav(elements));
	elements.navLeft.addEventListener('swipeLeft', () => elements.navLeft.classList.remove('open'));
	elements.openNavRightBtn.addEventListener('click', () => toggleRightNav(elements));
	elements.closeNavRightBtn.addEventListener('click', () => elements.navRight.classList.remove('open'));
	elements.arabic.addEventListener('swipeLeft', () => toggleRightNav(elements));
	elements.navRight.addEventListener('swipeRight', () => elements.navRight.classList.remove('open'));
	elements.arabic.addEventListener('click', () => closePanels(elements));
}

async function loadTabs(elements)
{
	const duas = getLabels(state.currentLanguage).duas;
	const entries = Object.keys(duas).filter(dua => dua !== 'jawshan');

	await Promise.all(entries.map(async dua => {
		const html = await loadText(`dua.php?slug=${encodeURIComponent(dua)}&language=ar`);
		const target = document.getElementById(dua);
		if (!target) {
			return;
		}

		target.innerHTML = html ?? renderLoadError(getLabels(state.currentLanguage).content_load_error);
	}));
}

function renderLoadError(message)
{
	return `<div class="latin"><p class="content_notice">${message}</p></div>`;
}

function addBookmark(elements, bookmarkTarget, bookmarkLabel)
{
	setBookmark(elements, bookmarkTarget, bookmarkLabel, target => gotoBookmark(elements, target));
	saveValue('bookmarkTarget', bookmarkTarget);
	saveValue('bookmarkLabel', bookmarkLabel);
}

function gotoBookmark(elements, bookmarkTarget)
{
	closePanels(elements);
	return scrollToId(bookmarkTarget, elements.navTop.offsetHeight);
}

function restoreBookmark(elements)
{
	const bookmarkTarget = loadValue('bookmarkTarget');
	const bookmarkLabel = loadValue('bookmarkLabel');

	if (!bookmarkTarget || !bookmarkLabel) {
		return;
	}

	setBookmark(elements, bookmarkTarget, bookmarkLabel, target => gotoBookmark(elements, target));
	if (!gotoBookmark(elements, bookmarkTarget)) {
		clearBookmark();
		removeValue('bookmarkTarget');
		removeValue('bookmarkLabel');
	}
}

function removeBookmark()
{
	if (!document.getElementById('bookmark')) {
		return;
	}

	if (confirm(getLabels(state.currentLanguage).confirm_delete_bookmark)) {
		clearBookmark();
		removeValue('bookmarkTarget');
		removeValue('bookmarkLabel');
	}
}

function resetSettings(elements)
{
	elements.fontFamilyList.value = defaults.fontFamily;
	elements.fontSizeList.value = defaults.fontSize;
	elements.colorList.value = defaults.color;
	elements.bgColorList.value = defaults.bgColor;
	elements.languageList.value = preferredLanguage;

	applyAppearanceSettings(elements);
	void applyLanguage(elements, elements.languageList.value);
	closePanels(elements);
}

async function openInfoPopup(elements)
{
	closePanels(elements);
	const html = await loadText(`dua.php?slug=program_info&language=${encodeURIComponent(state.currentLanguage)}`);
	elements.programInfoContent.innerHTML = html ?? renderLoadError(getLabels(state.currentLanguage).program_info_load_error);
	elements.programInfoPopup.classList.add('open');
}

function paragraphToTop(elements)
{
	const value = elements.paragraphNo.value.trim();
	if (!/^\d{1,3}$/.test(value)) {
		return;
	}

	closePanels(elements);
	scrollToId(`p${value}`, elements.navTop.offsetHeight);
}
