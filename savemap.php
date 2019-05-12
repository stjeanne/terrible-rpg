<?php 

	echo 'can u hear me i live in the php file\n';

	$fname = htmlspecialchars($_POST["targ"]);

	echo $fname . ', does it exist?\n';

	$fh = fopen($fname, 'w') or die("can't open file");

	$level = htmlspecialchars($_POST["data"]);

	echo 'hold onto ur butts, writing level strings \n';

	fwrite($fh, htmlspecialchars_decode($level));
	fclose($fh);

?>