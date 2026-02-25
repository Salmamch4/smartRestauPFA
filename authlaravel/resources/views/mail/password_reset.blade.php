<!DOCTYPE html>
<html>
<head>
    <title>Password Reset</title>
</head>
<body>
<h1>Password Reset Request</h1>
<p>We received a request to reset your password. Click the link below to reset your password:</p>
<p>
    <a href="{{ url('/password/reset/'.$token) }}">Click here to reset your password</a>
</p>
<p>If you did not request a password reset, please ignore this email.</p>
</body>
</html>
