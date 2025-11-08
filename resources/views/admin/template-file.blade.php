<!DOCTYPE html>
<html>
<head>
    <title>{{ $content ? strip_tags($content) : 'Newsletter' }}</title>
</head>
<body>
    <div>
        {!! $content !!}
    </div>
    <hr style="margin-top: 30px; margin-bottom: 10px;">

    <h5 style="font-family: sans-serif; color: #555;">
        If you no longer wish to receive these emails, please click here to
        @php

        $userId = base64_encode($user->id);

        @endphp
        <a href="{{ route('emailUnsubscribeUser',$userId) }}" style="color: #1a73e8;">unsubscribe</a>.
         

    </h5>
</body>
</html>