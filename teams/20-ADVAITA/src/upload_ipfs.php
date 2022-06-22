<?php
/**
 * Upload to IPFS
 * Special thanks to: sinso
 * More access to: https://getway.sinso.io
 */

$token = "input you token";
$fileName = "Enter_the_file_path_here.jpg";
$fileDir = "./";
$contentType = "image/jpg";
$body = file_get_contents($fileDir . $fileName);

$gateway = "https://api-ap-singapore-1.getway.sinso.io";
$url = $gateway . "/v1/upload?name=" . $fileName;
$res = upload($url, $token, $contentType, $body);

$info = json_decode($res, true);
//Success returns the hash
if ($info["error_code"] == 0) {
	echo "upload success\n";
	var_dump($info);
} else {
	echo "upload fail\n";
	echo $res;
}

function upload($url, $token, $contentType, $body) {
	$curl = curl_init($url);
	curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($curl, CURLOPT_POST, true);
	curl_setopt($curl, CURLOPT_POSTFIELDS, $body);
	curl_setopt($curl, CURLOPT_HTTPHEADER, ["Token: $token",
		"Content-Type: $contentType"]);

	$response = curl_exec($curl);
	curl_close($curl);
	return $response;
}