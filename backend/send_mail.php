<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;


require 'vendor/autoload.php'; 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $recipient = $_POST['email'];

    if (isset($_FILES['attachment']) && $_FILES['attachment']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['attachment']['tmp_name'];
        $fileName = $_FILES['attachment']['name'];

        $mail = new PHPMailer(true);
        try {
            // Server settings
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com'; // or your mail server
            $mail->SMTPAuth = true;
            $mail->Username = 'noreply.cogmac@gmail.com';
            $mail->Password = 'ughzqlbdcseqxqsq'; // Use App password for Gmail
            $mail->SMTPSecure = 'tls';
            $mail->Port = 587;

            // Email content
            $mail->setFrom('noreply.cogmac@gmail.com', 'Testing purpose only!!');
            $mail->addAddress($recipient);
            $mail->Subject = 'File Attachment';
            $mail->Body = 'Please find the attached file.';
            $mail->addAttachment($fileTmpPath, $fileName);

            $mail->send();
            echo json_encode(['message' => 'Email sent successfully!']);
        } catch (Exception $e) {
            echo json_encode(['message' => 'Email could not be sent. Error: ' . $mail->ErrorInfo]);
        }
    } else {
        echo json_encode(['message' => 'No valid file uploaded']);
    }
} else {
    echo json_encode(['message' => 'Invalid request']);
}
