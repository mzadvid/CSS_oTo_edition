<?

if ($_POST['css_props'] != '')
{
	$fp = fopen('CSS_oTo_modele_properties_new.js', 'w+');	
	if (fputs ($fp, stripslashes(preg_replace('/&gt;/', '>', preg_replace('/&lt;/s', '<', $_POST['css_props']))))) // /*.replace(/&lt;/g, '<').replace(/&gt;/g, '>')*/
		$isok = 'fichier sauvegardé';
	else
		$isok = 'probleme de sauvegarde';
	
	fclose ($fp);
	
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Untitled Document</title>
</head>

<body>
<? echo $isok; ?><br>
<form action="" method="post">

<textarea name="css_props" id="css_props" onchange="form.submit();"></textarea>
<form>

</body>
</html>