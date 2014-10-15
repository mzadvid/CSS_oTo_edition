<?

$bou = '';

$string_css = preg_replace('/\s+/s', ' ', file_get_contents('CSS_oTo_modele.js'));

// echo $string_css;
preg_match_all("/oTo_CSS_modele\['properties'\]\['([^']+)'\]/s", $string_css, $result);

echo implode('<br>', array_unique($result[1]));

// echo '<br><br><br><br>';

// print_r($result);
// print_r($result[1]);

?>