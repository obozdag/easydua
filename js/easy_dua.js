window.onload = ()=>{

	// Define elements
	let bgColorList         = document.getElementById('bg_color_list');
	let bookmarkContainer   = document.getElementById('bookmark_container');
	let bookmarkIcon        = document.getElementById('bookmark_icon');
	let bottomBtn           = document.getElementById('bottom_btn');
	let closeNavLeftBtn     = document.getElementById('close_nav_left');
	let closeNavRightBtn    = document.getElementById('close_nav_right');
	let closePopupBtn       = document.getElementById('close_popup_btn');
	let colorList           = document.getElementById('color_list');
	let fontFamilyList      = document.getElementById('font_family_list');
	let fontSizeList        = document.getElementById('font_size_list');
	let languageList        = document.getElementById('language_list');
	let gotoParagraphBtn    = document.getElementById('goto_paragraph_btn');
	let navLeft             = document.getElementById('nav_left');
	let navRight            = document.getElementById('nav_right');
	let navTop              = document.getElementById('nav_top');
	let openNavLeftBtn      = document.getElementById('open_nav_left');
	let openNavRightBtn     = document.getElementById('open_nav_right');
	let paragraphNo         = document.getElementById('paragraph_no');
	let programInfoBtn      = document.getElementById('program_info_btn');
	let programInfoContent  = document.getElementById('program_info_content');
	let programInfoPopup    = document.getElementById('program_info_popup');
	let arabic              = document.getElementById('arabic');
	let resetBtn            = document.getElementById('reset_btn');
	let topBtn              = document.getElementById('top_btn');
	let duaList             = document.getElementById('dua_list');
	let settingsHeader      = document.getElementById('settings_header');

	// Anchors in arabic
	let paragraphAnchors    = document.querySelectorAll('.pa');

	// Labels
	let bgColorListLabel    = document.getElementById('bg_color_list_label');
	let colorListLabel      = document.getElementById('color_list_label');
	let fontFamilyListLabel = document.getElementById('font_family_list_label');
	let fontSizeListLabel   = document.getElementById('font_size_list_label');
	let languageListLabel   = document.getElementById('language_list_label');
	let paragraphInputLabel = document.getElementById('paragraph_input_label');
	let duaListLabel        = document.getElementById('dua_list_label');

	loading(false);

	// Set current language first
	if( typeof currentLanguage === 'undefined')
	{
		let lang   = navigator.language.split(/[_-]/)[0];

		if (languages.hasOwnProperty(lang))
		{
			defaultLanguage = lang;
		}
		else
		{
			defaultLanguage = 'en';
		}

		if (defaultLanguage != 'tr')
		{
			var currentLanguage = 'tr';
			replaceBookmarksAndInfos(defaultLanguage);
		}

		var currentLanguage = defaultLanguage;
	}

	setLabels(currentLanguage);
	fillSelects();
	fillTabLinks(currentLanguage);
	loadTabs()


	// Than install event listeners for quick responsiveness then settings if exist
	installEventListeners();
	restoreSettings();

	async function loadTabs()
	{
		duas =  translations[currentLanguage]['duas']
		for ([dua, value] of Object.entries(duas))
		{
			if(dua == 'jawshan') continue
			path = 'duas/'+dua+'.html'
			document.getElementById(dua).innerHTML = await fetch(path).then(data=>data.text()).then(html=>{ return html})
		}
	}

	function openTab(tab='jawshan')
	{
		console.log(tab)
		tabContents = document.getElementsByClassName('tabcontent')

		for (i = 0; i < tabContents.length; i++) {
			tabContents[i].style.display = "none"
		}

		document.getElementById(tab).style.display = 'block'
		closeNavs()
	}

	function installEventListeners()
	{
		// Language list
		languageList.addEventListener('change', (e)=>{
			setLanguage(languageList.value);
		});

		// Paragraph anchors
		for(let i=0; i < paragraphAnchors.length; i++)
		{
			paragraphAnchors[i].addEventListener('click', addBookmark, false);
		}

		// Font family List
		fontFamilyList.addEventListener('change', ()=>{
			setFontFamily(fontFamilyList.value);
		});

		// Font size list
		fontSizeList.addEventListener('change', (e)=>{
			setFontSize(fontSizeList.value);
		});

		// Color list
		colorList.addEventListener('change', (e)=>{
			setColor(colorList.value);
		});

		// Background color list
		bgColorList.addEventListener('change', (e)=>{
			setBgColor(bgColorList.value);
		});

		// Reset settings button
		resetBtn.addEventListener('click', (e)=>{
			resetSettings();
		});

		// Paragraph no input
		paragraphNo.addEventListener('keyup', function(e){if (e.keyCode == 13) paragraphToTop()});
		gotoParagraphBtn.addEventListener('click', paragraphToTop);

		// Arabic to top
		topBtn.addEventListener('click', arabicToTop);

		// Arabic to bottom
		bottomBtn.addEventListener('click', arabicToBottom);

		// Clean bookmark
		bookmarkIcon.addEventListener('click', removeBookmark);

		// Program info
		programInfoPopup.addEventListener('click', closeInfoPopup);
		programInfoBtn.addEventListener('click', openInfoPopup);
		closePopupBtn.addEventListener('click', closeInfoPopup);

		// Nav left
		openNavLeftBtn.addEventListener('click', openNavLeft);
		closeNavLeftBtn.addEventListener('click', closeNavLeft);
		arabic.addEventListener('swipeRight', openNavLeft);
		navLeft.addEventListener('swipeLeft', closeNavLeft);

		// Nav right
		openNavRightBtn.addEventListener('click', openNavRight);
		closeNavRightBtn.addEventListener('click', closeNavRight);
		arabic.addEventListener('swipeLeft', openNavRight);
		navRight.addEventListener('swipeRight', closeNavRight);

		arabic.addEventListener('click', closeNavs);
	}

	function restoreSettings()
	{
		// Restore bookmark
		if (localStorage.getItem('bookmarkTarget'))
		{
			bookmarkTarget = localStorage.getItem('bookmarkTarget');
			bookmarkLabel  = localStorage.getItem('bookmarkLabel');
			setBookmark(bookmarkTarget, bookmarkLabel);
			gotoBookmark(bookmarkTarget);
		}

		// Restore language
		if (localStorage.getItem('language'))
		{
			language = localStorage.getItem('language');
			languageList.value = language;
			setLanguage(language);
		}

		// Restore font family
		if (localStorage.getItem('fontFamily'))
		{
			fontFamily = localStorage.getItem('fontFamily');
			fontFamilyList.value = fontFamily;
			setFontFamily(fontFamily);
		}

		// Restore font size
		if (localStorage.getItem('fontSize'))
		{
			fontSize = localStorage.getItem('fontSize');
			fontSizeList.value = fontSize;
			setFontSize(fontSize);
		}

		// Restore color
		if (localStorage.getItem('color'))
		{
			color = localStorage.getItem('color');
			colorList.value = color;
			setColor(color);
		}

		// Restore background color
		if (localStorage.getItem('bgColor'))
		{
			bgColor = localStorage.getItem('bgColor');
			bgColorList.value = bgColor;
			setBgColor(bgColor);
		}
	}

	function setLanguage(language)
	{
		setLabels(language);
		fillTabLinks(language)
		replaceBookmarksAndInfos(language);

		currentLanguage = language;
		localStorage.setItem('language', language);
		closeNavs();
	}

	function replaceBookmarksAndInfos(language)
	{
		for (var i = 0; i < paragraphAnchors.length; i++) {
			paragraphAnchors[i].textContent = paragraphAnchors[i].textContent.replace(translations[currentLanguage]['paragraph_anchor_label'], translations[language]['paragraph_anchor_label']);
		}

		let bookmark = document.getElementById('bookmark');
		if (bookmark)
		{
			bookmark.textContent = bookmark.textContent.replace(translations[currentLanguage]['paragraph_anchor_label'], translations[language]['paragraph_anchor_label']);
		}
	}

	function setLabels(language)
	{
		paragraphInputLabel.textContent = translations[language][paragraphInputLabel.id];
		fontFamilyListLabel.textContent = translations[language][fontFamilyListLabel.id];
		fontSizeListLabel.textContent   = translations[language][fontSizeListLabel.id];
		colorListLabel.textContent      = translations[language][colorListLabel.id];
		bgColorListLabel.textContent    = translations[language][bgColorListLabel.id];
		languageListLabel.textContent   = translations[language][languageListLabel.id];
		gotoParagraphBtn.textContent    = translations[language][gotoParagraphBtn.id];
		resetBtn.textContent            = translations[language][resetBtn.id];
		duaListLabel.textContent        = translations[language][duaListLabel.id];
		settingsHeader.textContent      = translations[language][settingsHeader.id];
	}

	function fillSelects()
	{
		createOptions(fontFamilyList, fontFamilies, defaultFontFamily);
		createOptions(fontSizeList, fontSizes, defaultFontSize);
		createOptions(colorList, colors, defaultColor);
		createOptions(bgColorList, bgColors, defaultBgColor);
		createOptions(languageList, languages, defaultLanguage);
	}

	function createOptions(selectElement, options, defaultOption)
	{
		for ([value, text] of Object.entries(options))
		{
			option = document.createElement('option');
			option.value = value;
			option.textContent = text;
			selectElement.appendChild(option);
			if (defaultOption == value) selectElement.value = value;
		}
	}

	function fillTabLinks(language)
	{
		let listElement = duaList
		let listItems   = translations[language]['duas']

		// First remove list items before adding new ones
		while(child = listElement.lastChild){listElement.removeChild(child)}

		for ([value, text] of Object.entries(listItems))
		{
			let listItem = document.createElement('li');
			listItem.id = value+'_tab';
			listItem.dataset.target = value;
			listItem.textContent = text;
			listItem.classList.add('tablink');
			listItem.addEventListener('click', ()=>{openTab(listItem.dataset.target)})
			listElement.appendChild(listItem);
		}
	}

	function addBookmark()
	{
		bookmarkTarget = this.dataset.target;
		bookmarkLabel  = this.textContent;
		setBookmark(bookmarkTarget, bookmarkLabel);
		localStorage.setItem('bookmarkTarget', bookmarkTarget);
		localStorage.setItem('bookmarkLabel', bookmarkLabel);
	}

	function setBookmark(bookmarkTarget, bookmarkLabel)
	{
		bookmark = document.getElementById('bookmark');
		if(bookmark) bookmark.remove();

		newBookmark                = document.createElement('span');
		newBookmark.id             = 'bookmark';
		newBookmark.dataset.target = bookmarkTarget;
		newBookmarkLabel           = document.createTextNode(bookmarkLabel);
		newBookmark.appendChild(newBookmarkLabel);
		newBookmark.addEventListener('click', ()=>{gotoBookmark(bookmarkTarget)});
		bookmarkContainer.appendChild(newBookmark);
	}

	function gotoBookmark(bookmarkTarget)
	{
		closeNavs();
		document.getElementById(bookmarkTarget).scrollIntoView();
		window.scrollBy(0, -navTop.offsetHeight);
	}

	function removeBookmark()
	{
		let bookmark = document.getElementById('bookmark');

		if (bookmark)
		{
			let answer = confirm(translations[currentLanguage]['confirm_delete_bookmark']);
			if (answer)
			{
				bookmark.remove();
				localStorage.removeItem('bookmarkTarget');
				localStorage.removeItem('bookmarkLabel');
			}
		}
	}

	function setColor(color)
	{
		document.documentElement.style.setProperty('--set-color', color);
		localStorage.setItem('color', color);
		closeNavs();
	}

	async function setBgColor(bgColor)
	{
		function setProp(){
			document.documentElement.style.setProperty('--set-bg-color', bgColor);
		}
		await setProp()
		console.log('bg changed')
		localStorage.setItem('bgColor', bgColor);
		closeNavs();
	}

	async function setFontSize(fontSize)
	{
		document.documentElement.style.setProperty('--set-font-size', fontSize)
		localStorage.setItem('fontSize', fontSize);
		closeNavs();
	}

	function setFontFamily(fontFamily)
	{
		document.documentElement.style.setProperty('--set-font-family', fontFamily);
		localStorage.setItem('fontFamily', fontFamily);
		closeNavs();
	}

	function resetSettings()
	{
		// Reset selection list values
		fontFamilyList.value = defaultFontFamily;
		fontSizeList.value   = defaultFontSize;
		colorList.value      = defaultColor;
		bgColorList.value    = defaultBgColor;
		languageList.value   = defaultLanguage;

		// Propagate reset settings
		fontFamilyList.dispatchEvent(new Event('change', {'bubbles': true}));
		fontSizeList.dispatchEvent(new Event('change', {'bubbles': true}));
		colorList.dispatchEvent(new Event('change', {'bubbles': true}));
		bgColorList.dispatchEvent(new Event('change', {'bubbles': true}));
		languageList.dispatchEvent(new Event('change', {'bubbles': true}));
	}

	function closeNavs()
	{
		navLeft.classList.remove('open');
		navRight.classList.remove('open');
		programInfoPopup.classList.remove('open');
	}

	function closeNavLeft()
	{
		navLeft.classList.remove('open');
	}

	function closeNavRight()
	{
		navRight.classList.remove('open');
	}

	function openNavLeft()
	{
		navLeft.classList.toggle('open');
		navRight.classList.remove('open');
		programInfoPopup.classList.remove('open');
	}

	function openNavRight()
	{
		navLeft.classList.remove('open');
		navRight.classList.toggle('open');
		programInfoPopup.classList.remove('open');
	}

	async function openInfoPopup()
	{
		navLeft.classList.remove('open');
		navRight.classList.remove('open');
		programInfoContent.innerHTML = await fetchLangHTML(currentLanguage, 'program_info')
		programInfoPopup.classList.toggle('open');
	}

	async function fetchLangHTML(language, file)
	{
		result = ''
		path = 'languages/'+language+'/'+file+'.html?'+Date.now()
		await fetch(path).then(data=>data.text()).then(html=>{
			result = html
		})
		return result
	}

	function closeInfoPopup()
	{
		programInfoPopup.classList.remove('open');
	}

	function arabicToTop()
	{
		closeNavs();
		document.getElementById('arabic').scrollIntoView();
	}

	function arabicToBottom()
	{
		closeNavs();
		document.getElementById('arabic').scrollIntoView({block:'end'});
	}

	function paragraphToTop()
	{
		closeNavs();
		document.getElementById('p'+paragraphNo.value).scrollIntoView();
		window.scrollBy(0, -navTop.offsetHeight);
	}
};

function loading(load = true, opacity = 1)
{
	let loadingOverlay = document.getElementById('loading_overlay');

	if(load)
	{
		loadingOverlay.style.display = 'block';
		loadingOverlay.style.opacity = opacity;
		loadingOverlay.style.visibility = 'visible';
	}
	else
	{
		loadingOverlay.style.opacity = '0';
		loadingOverlay.style.visibility = 'hidden';
		loadingOverlay.style.display = 'none';

	}

}
