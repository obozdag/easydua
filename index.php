<?php
	$version     = 'v1.3.21';
	$color       = 'steelblue';
	$pdo         = new PDO('sqlite:db/cevsen.db');
	$rows_cevsen = $pdo->query('SELECT * FROM fkl_cevsen');
?>
<!DOCTYPE html>
<html lang="ar">
<head>
	<title>Easy Dua</title>
	<meta charset="utf-8">
	<meta name="description" content="Easy Dua, easy to read, easy to scroll (top-to-bottom), lightweight (200KB), lightning fast, multi language, responsive, progressive web app.">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="apple-mobile-web-app-status-bar" content="<?= $color ?>">
	<meta name="theme-color" content="<?= $color ?>">
	<link rel="canonical" href="https://dua.fklavye.net">
	<link rel="stylesheet" type="text/css" href="/css/easy_dua.css">
	<link rel="apple-touch-icon" href="/css/icons/easy_dua_96x96.png">
	<link rel="manifest" href="easy_dua.json">
</head>
<body>
	<div id="loading_overlay">
		<div id="loading_content">
			<h3>Easy Dua</h3>
			<p><img src="/css/icons/loading.gif"></p>
			<p>Loading...</p>
			<p>dua.fklavye.net</p>
		</div>
	</div>
	<nav id="nav_top">
		<i id="open_nav_left" class="nav_top_btn rb-book-quran" title="Nav Left"></i>
		<i id="program_info_btn" class="nav_top_btn rb-hands-praying-solid" title="Program Info"></i>
		<i id="top_btn" class="nav_top_btn rb-up" title="Top"></i>
		<i id="bottom_btn" class="nav_top_btn rb-down" title="Bottom"></i>
		<span><i id="bookmark_icon" class="nav_top_btn rb-bookmark" title="Bookmark"></i><span id="bookmark_container"></span></span>
		<i id="open_nav_right" class="nav_top_btn rb-slider" title="Nav Right"></i>
	</nav>
	<nav id="nav_left">
		<i class="close_btn right rb-circle-xmark" id="close_nav_left"></i>
		<div class="settings">
			<div class="row">
				<label id="paragraph_input_label"></label>
				<span class="goto_paragraph_container">
					<input type="text" id="paragraph_no" size="3" min="0" max="100" maxlength="3" pattern="\d{1,3}" title="Paragraph 1-100">
					<button type="button" class="btn btn_nav" id="goto_paragraph_btn"></button>
				</span>
			</div>
			<div class="row" id="dua_list_row">
				<label id="dua_list_label"></label>
				<div id="dua_list_container">
					<ul id="dua_list">
					</ul>
				</div>
			</div>
		</div>
	</nav>
	<nav id="nav_right">
		<i class="close_btn left rb-circle-xmark" id="close_nav_right"></i>
		<h4 id="settings_header"></h4>
		<div class="settings">
			<div class="row">
				<label id="font_family_list_label"></label>
				<select id="font_family_list"></select>
			</div>
			<div class="row">
				<label id="font_size_list_label"></label>
				<select id="font_size_list"></select>
			</div>
			<div class="row">
				<label id="color_list_label"></label>
				<select id="color_list"></select>
			</div>
			<div class="row">
				<label id="bg_color_list_label"></label>
				<select id="bg_color_list"></select>
			</div>
			<div class="row">
				<label id="language_list_label"></label>
				<select id="language_list"></select>
			</div>
			<div class="row">
				<label></label>
				<button type="button" class="btn btn_nav" id="reset_btn"></button>
			</div>
		</div>
	</nav>
	<div class="container">
		<div class="arabic" id="arabic">
			<div id="jawshan" class="tabcontent open">
				<h4 class="sn">Cevşen-i Kebir</h4>
				<p class="basmala">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحٖيمِ</p>
				<ul id="p1">
				<?php
				foreach($rows_cevsen as $row):
					$paragraph_no = $row['paragraph_no'];
					$sentence_no = '<i class="vn">('.$row['sentence_no'].')</i>';

					if ($paragraph_no == null):
					?>
						<li><?= $sentence_no ?><i><?= $row['sentence'] ?></i></li>
					<?php
					else:
						$paragraph_anchor_href  = 'p'.$paragraph_no;
					?>
						<li><i class="vn pa" data-target="<?= $paragraph_anchor_href ?>"><?= $paragraph_no ?></i><i class="ls"><?= $row['sentence'] ?></i></li>
					</ul>
						<?php	if ($paragraph_no <= 101): ?>
					<ul id="<?= 'p'.($paragraph_no+1) ?>">
						<?php	endif; ?>
					<?php	endif; ?>
				<?php	endforeach; ?>
				</ul>
			</div>
			<div id="ismi_azam" class="tabcontent"></div>
			<div id="tercumani_ismi_azam" class="tabcontent"></div>
			<div id="munacati_veysel_karani" class="tabcontent"></div>
			<div id="sekine" class="tabcontent"></div>
			<div id="tefriciye" class="tabcontent"></div>
			<div id="ashabi_bedir" class="tabcontent"></div>
			<div id="suhedai_uhud" class="tabcontent"></div>
			<div id="dualar" class="tabcontent"></div>
		</div>
	</div>
	<footer><a target="_blank" href="https://github.com/obozdag/dua"><i class="logo rb-hands-praying-solid" title="Easy Dua"></i> Easy Dua</a></footer>
	<div class="overlay" id="program_info_popup">
		<div class="popup">
			<i id="close_popup_btn" class="close_btn right rb-circle-xmark"></i>
			<h3><i class="rb-hands-praying-solid logo"></i> Easy Dua <?= $version ?></h3>
			<div id="program_info_content">
			</div>
		</div>
	</div>
	<script src="/js/swipe.js"></script>
	<script src="/js/lang.js"></script>
	<script src="/js/settings.js"></script>
	<script src="/js/easy_dua.js"></script>
	<script src="/app.js"></script>
	<!--index.php-->
</body>
</html>
