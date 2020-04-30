<?php require 'db.php'; ?>
<!DOCTYPE html>
<html>
<head>
	<title>Easy Dua</title>
	<meta charset="utf-8">
	<meta name="description" content="Easy Dua, easy to read, easy to scroll (top-to-bottom), lightweight (2.7MB), lightning fast, multi language, responsive, progressive web app.">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="apple-mobile-web-app-status-bar" content="#4682b4">
	<meta name="theme-color" content="#4682b4">
	<link rel="stylesheet" type="text/css" href="css/dua.css">
	<link rel="apple-touch-icon" href="css/icons/dua_96x96.png">
	<!-- <link rel="manifest" href="dua.json"> -->
</head>
<body>
	<div id="loading_overlay">
		<div id="loading_content">
			<h3>Easy Dua</h3>
			<p><img id="loading_image" src="css/icons/loading.gif"></p>
			<p>Loading...</p>
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
		<dl class="settings">
			<dt id="paragraph_input_label"></dt>
			<dd>
				<span class="goto_paragraph_container">
					<input type="text" id="paragraph_no" size="3" min="0" max="100" maxlength="3" pattern="\d{1,3}" title="Paragraph 1-100">
					<button type="button" class="btn btn_nav" id="goto_paragraph_btn"></button>
				</span>
			</dd>
		</dl>
	</nav>
	<nav id="nav_right">
		<i class="rb close_btn left" id="close_nav_right">c</i>
		<dl class="settings">
			<dt id="font_family_list_label"></dt>
			<dd>
				<select id="font_family_list"></select>
			</dd>
			<dt id="font_size_list_label"></dt>
			<dd>
				<select id="font_size_list"></select>
			</dd>
			<dt id="color_list_label"></dt>
			<dd>
				<select id="color_list"></select>
			</dd>
			<dt id="bg_color_list_label"></dt>
			<dd>
				<select id="bg_color_list"></select>
			</dd>
			<dt id="language_list_label"></dt>
			<dd>
				<select id="language_list"></select>
			</dd>
			<dt></dt>
			<dd>
				<button type="button" class="btn btn_nav" id="reset_btn"></button>
			</dd>
		</dl>
	</nav>
	<div class="container">
		<div class="arabic" id="arabic">
			<p class="basmala">بِسْمِ اللَّهِ الرَّحْمٰنِ الرَّحِيمِ</p>
			<ul id="p1">
			<?php
			foreach($rows_cevsen as $row):
				if ($row['paragraph_no'] == null):
				?>
					<li><i class="vn">(<?= $row['sentence_no'] ?>)</i><i><?= $row['sentence'] ?></i></li>
				<?php
				else:
					$paragraph_anchor_href  = 'p'.$row['paragraph_no'];
				?>
					<li><i class="vn pa" data-target="<?= $paragraph_anchor_href ?>"><?= $row['paragraph_no'] ?></i><i class="ls"><?= $row['sentence'] ?></i></li>
				</ul>
					<?php
					if (($row['paragraph_no']+0) < 101): ?>
						<ul id="<?= 'p'.($row['paragraph_no']+1) ?>">
					<?php
					endif; ?>
				<?php
				endif; ?>
			<?php
			endforeach; ?>
			</ul>
		</div>
	</div>
	<footer><a target="_blank" href="https://github.com/obozdag/dua"><i class="rb logo" title="Easy Dua">r</i> Easy Dua</a></footer>
	<div class="overlay" id="program_info_popup">
		<div class="popup">
			<i id="close_popup_btn" class="rb close_btn right">c</i>
			<h3><i class="rb logo">a</i> Easy Dua <?= $version ?></h3>
			<div id="program_info_content">
			</div>
		</div>
	</div>
	<script src="js/swipe.js"></script>
	<script src="js/lang.js"></script>
	<script src="js/settings.js"></script>
	<script src="js/dua.js"></script>
	<!-- <script src="app.js"></script> -->
</body>
</html>
