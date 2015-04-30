<?php

//making username and password to work

require_once(__DIR__ . "/../model/config.php");

$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);

$query = $_SESSION["connection"]->query("SELECT salt, password FROM users WHERE username = '$username'");

if($query->num_rows == 1){
    $row = $query->fetch_array();
    
    if($row["password"] === crypt($password, $row["salt"])){
       $_SESSION["authenticated"] = true;
        header("Location: " . $path . "index.php");
    }
    else{
        echo " Invalid username and password";
    }
}
else{
    echo "Invalid username and password";
}
