<?php
require 'db_connect.php';

if(!$conn)
	echo mysqli_connect_error();

//On production MySQL server verses were only question marks. Adding this command it is solved.
mysqli_set_charset($conn, 'utf8');

//Get cevsen sentences
$sql_cevsen     = "SELECT * FROM fkl_cevsen";
$result_cevsen  = mysqli_query($conn, $sql_cevsen);
$rows_cevsen    = mysqli_fetch_all($result_cevsen, MYSQLI_ASSOC);


mysqli_free_result($result_cevsen);
mysqli_close($conn);

$version = 'v1.1';