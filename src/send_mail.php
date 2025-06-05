<?php
require_once "Mail.php";
require_once "Net/SMTP.php"; 
ini_set('include_path', '/usr/share/php:' . ini_get('include_path'));

// SMTP configuration
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', '587');
define('SMTP_USERNAME', 'noreply.cogmac@gmail.com');
define('SMTP_PASSWORD', 'ughzqlbdcseqxqsq');

// Default settings sales@oxycea.com, rakesh@cogmac.com, rajendu@cogmac.com, contact@cogmac.com, rajat.chaudhary@cogmac.com,
$defaultFrom = "query@brewmac.com";
$recipients = " vishal@cogmac.com";
$defaultName = "Oxycea Website User";
$subject = "New Message received for testing";

// Capture and sanitize form inputs
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['name'], $_POST['email'])) {
    $from = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $name = filter_var($_POST['name'], FILTER_SANITIZE_STRING);
    $subject = "Message from " . stripslashes($name);
} else {
    $from = $defaultFrom;
    $name = $defaultName;
}

// Construct the email message
$message = "<html><head><title>$subject</title></head><body>\n";
$message .= "<div style='border-bottom:1px solid #dadada; padding-bottom:15px;margin-bottom:15px;'><strong>From:</strong><br/>" . stripslashes($name) . " (" . stripslashes($from) . ")</div>\n";
foreach ($_POST as $field => $data) {
    if ($field !== 'submit') {
        $message .= "<div style='border-bottom:1px solid #dadada; padding-bottom:15px;margin-bottom:15px;'><strong>" . ucwords($field) . "</strong><br/>" . stripslashes($data) . "</div>\n";
    }
}
$message .= "</body></html>";

// Set email headers
$headers = array(
    'From' => $from,
    'To' => $recipients,
    'Subject' => $subject,
    'Content-Type' => 'text/html; charset=iso-8859-1',
    'MIME-Version' => '1.0',
);

// Create SMTP connection
$smtp = Mail::factory('smtp', array(
    'host' => SMTP_HOST,
    'port' => SMTP_PORT,
    'auth' => true,
    'username' => SMTP_USERNAME,
    'password' => SMTP_PASSWORD
));

// Send the email
$mail = $smtp->send($recipients, $headers, $message);

// Check for errors
if (PEAR::isError($mail)) {
    echo "<p>ERROR: " . $mail->getMessage() . "</p>";
} else {
    echo '<div style="margin-top: 20px;" class="alert alert-success alert-dismissible fade show" role="alert">
            Your message has been sent successfully.
          </div>';
}
?>
