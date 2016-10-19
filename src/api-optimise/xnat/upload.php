<?php

	//$target_dir = "/home/ubuntu/upload/";
     	//$name = $_POST['name'];
     	//print_r($name);
	
	//$target_file = $target_dir . basename($_FILES["file"]["name"]);
	//echo "Target File name: ".$target_dir."\n";
	//echo "File name: ".($_FILES["file"]["tmp_name"])."\n";
	//$file_data_str = fread($zippedFile, filesize($file_path_str));
	
	//$move_response = move_uploaded_file($_FILES["file"]["tmp_name"], $target_file);
	//echo "Move response: ".$move_response."\n";
	//echo $zippedFile;
	
	/*
	$log = "Filesize:". filesize($_FILES["file"]["tmp_name"]) ."\n" ;
	
	$max_checks = 5;
	$differenceSinceLastModified = 5;
	$difference = 0;
	$checks = 0;
	while (checks < $max_checks) {
	    $now = time();
	    $last_modified = filemtime($_FILES["file"]["tmp_name"]);
	    $difference = $now - $last_modified;
	    $log = $log . "Now:".$now."\n";
	    $log = $log . "Last modified: ".$last_modified."\n";
	    $log = $log . "Difference: ".$difference."\n\n";
	    if ($difference > $differenceSinceLastModified) {
	        $log = $log .  "breaking\n\n";
	       break;
	    }
	    sleep(30);
	    $checks = $checks + 1;	
	}
	
	$log = $log . "Filesize:". filesize($_FILES["file"]["tmp_name"])."\n";
	echo $log; 
	*/

	
	
	
	
	echo ini_get('post_max_size')."\n";
	echo ini_get('upload_max_filesize')."\n";
	
	     
	$url = "https://central.xnat.org/data/projects/Optimise";
   	$cif_url = "http://cif-xnat.hh.med.ic.ac.uk/data/projects/Optimise";
   	$cif_url_login = "http://cif-xnat.hh.med.ic.ac.uk/REST/JSESSION";
   	//$cif_url_upload = "http://cif-xnat.hh.med.ic.ac.uk/data/services/import?format=html";

	$ch = curl_init();
   	$username = 'myyong';
   	$password = '150914_Bg';
   	curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);
   	curl_setopt($ch, CURLOPT_POST, 1);
   	curl_setopt($ch, CURLOPT_URL, $cif_url_login);
   	curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);
   	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 0);
   	$login_results = curl_exec($ch);
	echo "Login:".$login_results . "\n";

 	$subject_label = $_POST['USUBJID'];
  	echo "USUBJID: ".$subject_label."\n";
   	$subjects_ext = $cif_url."/subjects/".$subject_label;   
	$createSubject_url = $subjects_ext;//.'?'.$typeParams;
	curl_setopt($ch, CURLOPT_PUT, 1);
   	curl_setopt($ch, CURLOPT_URL, $createSubject_url);
   	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
   	$subject_id = curl_exec($ch);
	echo "Subject ID: " . $subject_id . "\n";
		
	$session_label = $_POST['USUBJID']."_".$_POST['sessionLabel'];
	echo $session_label;
	$session_date = $_POST['scanDate'];
	echo $session_date;
	$createSession_url = $cif_url . "/subjects/" . $subject_label . "/experiments/" . $session_label . "?xnat:mrSessionData/date=" . $session_date;
	curl_setopt($ch, CURLOPT_URL, $createSession_url);
	$session_id = curl_exec($ch);
	echo "Session ID: " . $session_id . "\n";
	
	$scan_type = $_POST['scanWeight'];// "T1";
	$scan_label = $_POST['scanWeight'];//"MPRAGE_P2_ADNI";
	$createScanDir_url = $cif_url . "/subjects/" . $subject_label . "/experiments/" . $session_label . "/scans/" . $scan_label;
	$createScanDir_url = $createScanDir_url . "?xsiType=xnat:mrScanData&xnat:mrScanData/type=" . $scan_type;
	curl_setopt($ch, CURLOPT_URL, $createScanDir_url);
	$scan_id = curl_exec($ch);
	echo $scan_id . "\n";
	$scan_content = $_POST['scanWeight']."_Raw";//"T1_Raw";
	$createScanRes_url = $cif_url . "/subjects/" . $subject_label . "/experiments/" . $session_label . "/scans/" . $scan_label;
	$createScanRes_url = $createScanRes_url . "/resources/DICOM/resources/DICOM?format=DICOM&content=" . $scan_content;
	curl_setopt($ch, CURLOPT_URL, $createScan_url);
	$res_id = curl_exec($ch);
	//echo $res_id . "\n";
	
	$upload_url = $cif_url . "/subjects/" . $subject_label . "/experiments/" . $session_label . "/scans/" . $scan_label;
	$upload_url = $upload_url . "/resources/DICOM/files/test.zip" . "?inbody=true&extract=true&overwrite=append";
	//$upload_url = $upload_url . "&file=@".$target_file . "&filename=".basename($_FILES['file']['name']);
	//$upload_url = $cif_url_upload;// . "PROJECT_ID=OPTIMISE" . "&SUBJECT_ID=".$subject_id ."&EXPT_LABEL=".$session_label;
	echo "Upload URL: ".$upload_url ."\n";
	
	
	//$post_vars = array('file'=> '@'.$_FILES['file']['tmp_name'] . ';filename=' . $_FILES['file']['name']);
	//$post_vars = array('file'=> '@'.$target_file . ';filename=' . $_FILES['file']['name']);
	//$post_vars = array('image_archive'=> '@'.$target_file . ';filename=' . $_FILES['file']['name'].";project=Optimise");
   	//$post_vars = array('file'=>curl_file_create($_FILES['file']['tmp_name'], $_FILES['file']['type'], basename($_FILES['file']['name'])));
	//echo json_encode($post_vars);
	//$post_vars["filename"] = '@'.$target_file;//$_FILES["file"]["tmp_name"];
   	
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);	
	curl_setopt($ch, CURLOPT_BINARYTRANSFER, 1);
	
	$zippedFile = fopen($_FILES["file"]["tmp_name"], "r");
	echo "File size:". filesize($_FILES['file']['tmp_name']);
	echo "File name:". $_FILES['file']['name'];
	//curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 2);
	
	curl_setopt($ch, CURLOPT_PUT, 1);
   	curl_setopt($ch, CURLOPT_INFILE, $zippedFile);
	
	curl_setopt($ch, CURLOPT_INFILESIZE, filesize($_FILES['file']['tmp_name']));
   	curl_setopt($ch, CURLOPT_URL, $upload_url);
   	
	$data = curl_exec($ch);
	echo $data;
	
	curl_close($ch);
	fclose($zippedFile);
	
?>