<?php
// Using Terminal to append all .sql files into one: cat sura_???.sql >> ../suras_all.sql (first > than >> to append not to overwrite)


// 24. paragraph has 11 sentences 264. line
// 73. and 86. paragraph has  9 sentences

function lines_to_sql()
{
	$text_file    = 'cevsen.txt';
	$sql_file     = 'cevsen.sql';
	$sentences    = file($text_file);
	$sentence_no  = 1;
	$paragraph_no = 1;
	$sentence_count = 11;

	foreach ($sentences as $sentence)
	{
		$sentence = trim($sentence);

		$sentence_count = ($paragraph_no == 73 || $paragraph_no == 86) ? 10 : (($paragraph_no == 24) ? 12 : 11);

// echo "sentence_no: $sentence_no paragraph_no: $paragraph_no sentence_count: $sentence_count.<br>";

		// If a new paragraph then write paragraph no otherwise leave null
		if ($sentence_no == $sentence_count)
		{
			$sql = "INSERT INTO fkl_cevsen (`paragraph_no`, `sentence`) VALUES ($paragraph_no, '$sentence');\n";
			// Reset sentence no to 1
			$sentence_no = 1;
			$paragraph_no++;
		}
		else
		{
			$sql = "INSERT INTO fkl_cevsen (`sentence_no`, `sentence`) VALUES ('$sentence_no', '$sentence');\n";
			$sentence_no++;
		}

		$cevsen[] = $sql;
	}

	// Add Cevsen dua
		$dua = file_get_contents('cevsen_dua.txt');
		$sql = "INSERT INTO fkl_cevsen (`sentence`) VALUES ('$dua');\n";
		$cevsen[]  = $sql;

	// print_r($cevsen);
	file_put_contents($sql_file, $cevsen);
}

lines_to_sql();