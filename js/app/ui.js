export function cacheElements()
{
	return {
		arabic: document.getElementById('arabic'),
		bgColorList: document.getElementById('bg_color_list'),
		bgColorListLabel: document.getElementById('bg_color_list_label'),
		bookmarkContainer: document.getElementById('bookmark_container'),
		bookmarkIcon: document.getElementById('bookmark_icon'),
		bottomBtn: document.getElementById('bottom_btn'),
		closeNavLeftBtn: document.getElementById('close_nav_left'),
		closeNavRightBtn: document.getElementById('close_nav_right'),
		closePopupBtn: document.getElementById('close_popup_btn'),
		colorList: document.getElementById('color_list'),
		colorListLabel: document.getElementById('color_list_label'),
		duaList: document.getElementById('dua_list'),
		duaListLabel: document.getElementById('dua_list_label'),
		fontFamilyList: document.getElementById('font_family_list'),
		fontFamilyListLabel: document.getElementById('font_family_list_label'),
		fontSizeList: document.getElementById('font_size_list'),
		fontSizeListLabel: document.getElementById('font_size_list_label'),
		gotoParagraphBtn: document.getElementById('goto_paragraph_btn'),
		languageList: document.getElementById('language_list'),
		languageListLabel: document.getElementById('language_list_label'),
		loadingOverlay: document.getElementById('loading_overlay'),
		navLeft: document.getElementById('nav_left'),
		navRight: document.getElementById('nav_right'),
		navTop: document.getElementById('nav_top'),
		openNavLeftBtn: document.getElementById('open_nav_left'),
		openNavRightBtn: document.getElementById('open_nav_right'),
		paragraphAnchors: Array.from(document.querySelectorAll('.pa')),
		paragraphInputLabel: document.getElementById('paragraph_input_label'),
		paragraphNo: document.getElementById('paragraph_no'),
		programInfoBtn: document.getElementById('program_info_btn'),
		programInfoContent: document.getElementById('program_info_content'),
		programInfoPopup: document.getElementById('program_info_popup'),
		resetBtn: document.getElementById('reset_btn'),
		settingsHeader: document.getElementById('settings_header'),
		tabContents: Array.from(document.getElementsByClassName('tabcontent')),
		topBtn: document.getElementById('top_btn'),
	};
}

export function loading(loadingOverlay, load = true, opacity = 1)
{
	if (!loadingOverlay) {
		return;
	}

	if (load) {
		loadingOverlay.style.display = 'block';
		loadingOverlay.style.opacity = opacity;
		loadingOverlay.style.visibility = 'visible';
		return;
	}

	loadingOverlay.style.opacity = '0';
	loadingOverlay.style.visibility = 'hidden';
	loadingOverlay.style.display = 'none';
}

export function applyLabels(elements, labels)
{
	const mapping = [
		[elements.paragraphInputLabel, 'paragraph_input_label'],
		[elements.fontFamilyListLabel, 'font_family_list_label'],
		[elements.fontSizeListLabel, 'font_size_list_label'],
		[elements.colorListLabel, 'color_list_label'],
		[elements.bgColorListLabel, 'bg_color_list_label'],
		[elements.languageListLabel, 'language_list_label'],
		[elements.gotoParagraphBtn, 'goto_paragraph_btn'],
		[elements.resetBtn, 'reset_btn'],
		[elements.duaListLabel, 'dua_list_label'],
		[elements.settingsHeader, 'settings_header'],
	];

	for (const [element, key] of mapping) {
		if (element) {
			element.textContent = labels[key];
		}
	}
}

export function fillSelect(selectElement, options, selectedValue)
{
	if (!selectElement) {
		return;
	}

	selectElement.replaceChildren();

	for (const [value, text] of Object.entries(options)) {
		const option = document.createElement('option');
		option.value = value;
		option.textContent = text;
		selectElement.appendChild(option);
	}

	selectElement.value = selectedValue;
}

export function renderTabLinks(listElement, items, onSelect)
{
	if (!listElement) {
		return;
	}

	listElement.replaceChildren();

	for (const [value, text] of Object.entries(items)) {
		const listItem = document.createElement('li');
		listItem.id = `${value}_tab`;
		listItem.dataset.target = value;
		listItem.textContent = text;
		listItem.classList.add('tablink');
		listItem.addEventListener('click', () => onSelect(value));
		listElement.appendChild(listItem);
	}
}

export function closePanels(elements)
{
	elements.navLeft?.classList.remove('open');
	elements.navRight?.classList.remove('open');
	elements.programInfoPopup?.classList.remove('open');
}

export function openTab(elements, tabId)
{
	for (const tabContent of elements.tabContents) {
		tabContent.style.display = 'none';
	}

	const target = document.getElementById(tabId);
	if (!target) {
		return false;
	}

	target.style.display = 'block';
	closePanels(elements);
	return true;
}

export function toggleLeftNav(elements)
{
	elements.navLeft?.classList.toggle('open');
	elements.navRight?.classList.remove('open');
	elements.programInfoPopup?.classList.remove('open');
}

export function toggleRightNav(elements)
{
	elements.navLeft?.classList.remove('open');
	elements.navRight?.classList.toggle('open');
	elements.programInfoPopup?.classList.remove('open');
}

export function setBookmark(elements, bookmarkTarget, bookmarkLabel, onClick)
{
	clearBookmark();

	const bookmark = document.createElement('span');
	bookmark.id = 'bookmark';
	bookmark.dataset.target = bookmarkTarget;
	bookmark.textContent = bookmarkLabel;
	bookmark.tabIndex = 0;
	bookmark.addEventListener('click', () => onClick(bookmarkTarget));
	bookmark.addEventListener('keyup', event => {
		if (event.key === 'Enter' || event.key === ' ') {
			onClick(bookmarkTarget);
		}
	});

	elements.bookmarkContainer?.appendChild(bookmark);
}

export function clearBookmark()
{
	document.getElementById('bookmark')?.remove();
}

export function scrollToId(id, offset = 0, options)
{
	const target = document.getElementById(id);
	if (!target) {
		return false;
	}

	target.scrollIntoView(options);
	if (offset !== 0) {
		window.scrollBy(0, -offset);
	}

	return true;
}
