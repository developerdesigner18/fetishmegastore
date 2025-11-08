<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
  <title>Unsubscribe from Newsletter</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f2f4f8;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .container {
      max-width: 500px;
      margin: 80px auto;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
      padding: 40px;
      text-align: center;
    }

    .logo {
      max-width: 120px;
      margin: 0 auto 20px;
    }

    h1 {
      font-size: 24px;
      margin-bottom: 10px;
      color: #333;
    }

    p {
      color: #666;
      margin-bottom: 30px;
    }

    .reasons {
      text-align: left;
      margin-bottom: 10px;
    }

    .reason-option {
      margin-bottom: 15px;
    }

    .reason-option input[type="radio"] {
      margin-right: 10px;
      accent-color: #0077ff;
    }

    .other-input {
      display: none;
      margin-top: 10px;
      text-align: left;
    }

    button {
      background-color: #0077ff;
      color: white;
      padding: 12px 25px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      transition: background 0.3s;
    }

    button:hover {
      background-color: #005ec2;
    }

    .footer-note {
      font-size: 13px;
      color: #aaa;
      margin-top: 25px;
    }
  </style>
</head>
<body>

  <div class="container">
     @if (opt('site_logo'))
        <div class="mb-3">
            <img src="{{ asset(opt('site_logo')) }}" class="logo" alt="Current Logo" />
        </div>
    @endif

    <h1>Unsubscribe from Our Newsletter</h1>
    <p>We're sorry to see you go. Please let us know why you're unsubscribing.</p>

    <form id="unsubscribe-form">
        @csrf

        <div class="reasons">
            @php
                $reasons = json_decode(opt('reason', '[]'), true) ?? [];

                if (($key = array_search('Other', $reasons)) !== false) {
                    unset($reasons[$key]);
                    $reasons[] = 'Other';
                }
            @endphp

            @foreach ($reasons as $reason)
                <div class="reason-option">
                    <input type="radio" id="reason_{{ $loop->index }}" name="reason" value="{{ $reason }}" required>
                    <label for="reason_{{ $loop->index }}">{{ $reason }}</label>
                </div>
            @endforeach

            <div id="other-box" class="other-input">
                <label for="other_reason">Please specify:</label><br>
                <input type="text" name="other_reason" id="other_reason" style="width: 100%; padding: 5px;" />
            </div>
        </div>

        <button type="submit" style="margin-top: 20px;">Unsubscribe me from all mailing lists</button>
    </form>

    <!-- <div class="footer-note">
      You can resubscribe anytime from your profile settings.
    </div> -->
  </div>

  <script>
    const radios = document.querySelectorAll('input[name="reason"]');
    const otherBox = document.getElementById('other-box');
    const form = document.getElementById('unsubscribe-form');

    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.value === 'Other') {
                otherBox.style.display = 'block';
            } else {
                otherBox.style.display = 'none';
                document.getElementById('other_reason').value = '';
            }
        });
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        Swal.fire({
            title: 'Are you sure?',
            text: "You want to unsubscribe from emails?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#aaa',
            confirmButtonText: 'Yes, unsubscribe me'
        }).then((result) => {
            if (result.isConfirmed) {
                const formData = new FormData(form);

                fetch("{{ route('submitEmailUnsubscribeUser', $id) }}", {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    },
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire({
                            title: 'Unsubscribed!',
                            html: `
                                <p>You have successfully unsubscribed from all email communications.</p>
                                <a href='{{ url('/') }}'>
                                    <button style="margin-top:10px; padding: 8px 16px; background-color: #3085d6; color: #fff; border: none; border-radius: 4px;">
                                        Ok
                                    </button>
                                </a>
                            `,
                            icon: 'success',
                            showConfirmButton: false
                        });
                    }
                });
            }
        });
    });
  </script>
</body>
</html>
