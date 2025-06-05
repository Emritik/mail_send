<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $to = $_POST['email'];

    if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Invalid email format.";
        exit;
    }

    $csvContent = "Testing a Mail_Setup";
    $fileName = "src\Datafile.csv";
    file_put_contents($fileName, $csvContent);

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com'; 
        $mail->SMTPAuth   = true;
        $mail->Username   = 'noreply.cogmac@gmail.com'; 
        $mail->Password   = 'ughzqlbdcseqxqsq';    
        $mail->SMTPSecure = 'tls';
        $mail->Port       = 587;

        // Recipients
        $mail->setFrom('noreply.cogmac@gmail.com', 'Mailer');
        $mail->addAddress($to);

        // Attachments
        $mail->addAttachment($fileName);

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'CSV File Attached';
        $mail->Body    = 'Here is your CSV file.';
        $mail->AltBody = 'Here is your CSV file.';

        $mail->send();
        echo 'Email has been sent';
    } catch (Exception $e) {
        echo "Message could not be sent. Error: {$mail->ErrorInfo}";
    }
    unlink($fileName);
} else {
    http_response_code(405);
    echo "Method Not Allowed";
}
