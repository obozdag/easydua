<?php require 'db.php'; ?>
<!DOCTYPE html>
<html lang="ar">
<head>
	<title>Easy Dua</title>
	<meta charset="utf-8">
	<meta name="description" content="Easy Dua, easy to read, easy to scroll (top-to-bottom), lightweight (200KB), lightning fast, multi language, responsive, progressive web app.">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="apple-mobile-web-app-status-bar" content="<?= $color ?>">
	<meta name="theme-color" content="<?= $color ?>">
	<link rel="preload" href="css/fonts/hamdullah.ttf" as="font" crossorigin>
	<link rel="preload" href="css/fonts/rb_icons.ttf" as="font" crossorigin>
	<link rel="stylesheet" type="text/css" href="css/easy_dua.css">
	<link rel="apple-touch-icon" href="css/icons/easy_dua_96x96.png">
	<link rel="manifest" href="easy_dua.json">
</head>
<body>
	<div id="loading_overlay">
		<div id="loading_content">
			<h3>Easy Dua</h3>
			<p><img src="css/icons/loading.gif"></p>
			<p>Loading...</p>
			<p>dua.fklavye.net</p>
		</div>
	</div>
	<nav id="nav_top">
		<i id="open_nav_left" class="nav_top_btn rb" title="Nav Left">q</i>
		<i id="program_info_btn" class="nav_top_btn rb" title="Program Info">r</i>
		<i id="top_btn" class="nav_top_btn rb" title="Top">t</i>
		<i id="bottom_btn" class="nav_top_btn rb" title="Bottom">d</i>
		<span><i class="nav_top_btn rb" id="bookmark_icon" title="Bookmark">b</i><span id="bookmark_container"></span></span>
		<i id="open_nav_right" class="nav_top_btn rb" title="Nav Right">s</i>
	</nav>
	<nav id="nav_left">
		<i class="rb close_btn right" id="close_nav_left">c</i>
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
		<i class="rb close_btn left" id="close_nav_right">c</i>
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
				<p class="basmala">بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ</p>
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
						<?php
						if ($paragraph_no <= 101): ?>
					<ul id="<?= 'p'.($paragraph_no+1) ?>">
						<?php
						endif; ?>
					<?php
					endif; ?>
				<?php
				endforeach; ?>
				</ul>
			</div>
			<div id="ismi_azam" class="tabcontent"></div>
			<div id="tercumani_ismi_azam" class="tabcontent"></div>
			<div id="munacati_veysel_karani" class="tabcontent"></div>
			<div id="sekine" class="tabcontent"></div>
			<div id="tefriciye" class="tabcontent"></div>
		</div>
	</div>
	<footer><a target="_blank" href="https://github.com/obozdag/dua"><i class="rb logo" title="Easy Dua">r</i> Easy Dua</a></footer>
	<div class="overlay" id="program_info_popup">
		<div class="popup">
			<i id="close_popup_btn" class="rb close_btn right">c</i>
			<h3><i class="rb logo">r</i> Easy Dua <?= $version ?></h3>
			<div id="program_info_content">
			</div>
		</div>
	</div>
	<script src="js/swipe.js"></script>
	<script src="js/lang.js"></script>
	<script src="js/settings.js"></script>
	<script src="js/easy_dua.js"></script>
	<!-- <script src="app.js"></script> -->
</body>
</html>
