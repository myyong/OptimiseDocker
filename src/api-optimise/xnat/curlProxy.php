<?php

   $url = "https://central.xnat.org/data/projects/Optimise"; 
   $cif_url = "http://cif-xnat.hh.med.ic.ac.uk/data/projects/Optimise";   
   $cif_url_login = "http://cif-xnat.hh.med.ic.ac.uk/REST/JSESSION";

   $ch = curl_init();
   $username = 'myyong';
   $password = '150914_Bg';

   curl_setopt($ch, CURLOPT_USERPWD, $username . ":" . $password);
   curl_setopt($ch, CURLOPT_POST, 1);
   curl_setopt($ch, CURLOPT_URL, $cif_url_login);   
   curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_BASIC);   
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, 0);
   $login_results = curl_exec($ch);

   //$subject_label = 'GSK131086_04';
   $subject_label=$_GET['USUBJID'];
   //echo $subject_label;
   //$session = $_GET['Session'];
   //echo $session;
   //$subject_id = 'CIF_S01671';
   $subjects_ext = $cif_url."/subjects/".$subject_label."/experiments/".$session;
   $typeParams = "format=json";
   $subjects_url = $subjects_ext.'?'.$typeParams;
   
   curl_setopt($ch, CURLOPT_HTTPGET, 1);
   curl_setopt($ch, CURLOPT_URL, $subjects_url);
   curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);   
   $content = curl_exec($ch);
   //echo "\n\n".$content;
   curl_close($ch);
   
   $items = json_decode ($content,1);
   $children = $items["items"][0]["children"][0];
   $scans = array();

   if ($children["field"]=="scans/scan") {
      $scanItems = $children["items"];
      for ($i=0; $i < count($scanItems); $i++) {
      	  $scanItem = array(
	  	      "ID"=>$scanItems[$i]["data_fields"]["ID"],
		      "Type"=>$scanItems[$i]["data_fields"]["type"]);
	  array_push($scans, $scanItem);	
	  }
   }
   $json = json_encode($scans);
   
   echo isset($_GET['callback']) ? "{$_GET['callback']}($json)" : $json;
            return;
   /*
   foreach ($children as $child) {
   	   var_dump($child[0]["]);
      if ($child["field"]=="scans/scan") {
         echo "a scan!";
         $childScans = $item["items"];
         foreach ($childScans as $childScan) {
            //echo "\n".$childScan["data_fields"]["ID"].": ".$childScan["data_fields"]["type"];
	    
            $scansItems = $experiment["children"];
            foreach ($scansItems as $scanItem) {
               if ($scanItem["field"]=="scans/scan"){
                  $scans = $scanItem["items"];
                  foreach ($scans as $scan) {
                     echo "\n\t".$scan["data_fields"]["type"];
                  };
               };
            };
	    
         }
      };
   };      
   */

//var_dump($items);
   /* 
   $items_children = $items["items"][0]["children"];
   var_dump($items_children);
   foreach ($items_children as $item) {
      
      if ($item["field"]=="experiments/experiment") {
      	 //var_dump($item);
	 echo $item["field"];
	 $experiments = $item["items"];
	 foreach ($experiments as $experiment) {
	    echo "\n".$experiment["data_fields"]["label"].": ".$experiment["data_fields"]["date"];
	    $scansItems = $experiment["children"];
	    foreach ($scansItems as $scanItem) {
	       if ($scanItem["field"]=="scans/scan"){
		  $scans = $scanItem["items"];
		  foreach ($scans as $scan) {
		     echo "\n\t".$scan["data_fields"]["type"];
		  };
	       };
	    }; 
//	    var_dump($experiment);
	 }
      };
   };
   */
  
   

?>