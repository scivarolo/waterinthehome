<?php 
if( isset($_POST["data"]) )
  {
  $var = $_POST["data"];
  $file = fopen('value.txt', 'w');
  echo fwrite($file, $var);
  fclose($file);
}
?>
