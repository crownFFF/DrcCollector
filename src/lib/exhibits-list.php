<?php
header('Access-Control-Allow-Origin:*');
header('Content-Type:application/json;chartset=utf-8');

require_once('./connection.php');

$sql = 'SELECT type FROM type';
$result = $link->query($sql);

$result_num = $result->rowCount();

if ($result_num > 0) {
  $retcode = [];
  while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
      $retcode[] = $row;
  }
} else {
  $retcode = "找不到相關資料";
}

echo json_encode($retcode, JSON_UNESCAPED_UNICODE);
return;