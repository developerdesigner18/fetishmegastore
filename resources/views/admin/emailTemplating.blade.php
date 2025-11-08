@extends('admin.base')

@section('section_title')
    <strong>{{ __('Send Email') }}</strong>
@endsection

@section('section_body')
<form id="send-newsletter-form" method="POST" action="{{ route('admin.sendNewsletter') }}">
    @csrf
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <x-label>{{ __("Select Template") }}</x-label>
            <select name="newsletter_id" id="newsletter_id" class="block w-full mb-4 border rounded p-2">
                <option value="">{{ __("Select Template") }}</option>
                @foreach($newsletters as $newsletter)
                    <option value="{{ $newsletter->id }}">{{ $newsletter->title }}</option>
                @endforeach
            </select>
        </div>

        <div>
            <x-label>{{ __("Filter Users") }}</x-label>
            <select name="user_filter" id="user_filter" class="block w-full mb-4 border rounded p-2">
                <option value="">{{ __("Select Filter") }}</option>
                <option value="all">All Users</option>
                <option value="streamers">Streamers</option>
                <option value="affiliate">Affiliate Users</option>
                <option value="no_tokens">Users Without Tokens</option>
            </select>
        </div>
    </div>

    <div id="user-list" style="display: none;">
       <x-label><span id="user-count-label">{{ __("Select Users") }}</span></x-label>
        <div class="mb-2">
            <label>
                <input type="checkbox" id="select-all" class="mr-2">
                <strong>{{ __("Select All") }}</strong>
            </label>
        </div>
        <div id="users-checkboxes"
            class="p-2 border rounded bg-white overflow-y-auto mb-4"
            style="max-height: 250px;">
        </div>
    </div>

    <div id="loader" style="display: none;" class="text-center mb-4">
        <span class="text-sm text-gray-600">Sending Emails...</span><br>
        <img src="{{ asset('images/loader.gif') }}" alt="Loading..." class="w-12 h-12 inline-block">
    </div>

    <div id="loader2" style="display: none;" class="text-center mb-4">
        <span id="loader-text" class="text-sm text-gray-600">Getting Users...</span><br>
        <img src="{{ asset('images/loader.gif') }}" alt="Loading..." class="w-12 h-12 inline-block">
    </div>

    <x-button>{{ __('Send Email') }}</x-button>
</form>
@endsection

@push('adminExtraJS')
<script src="https://code.jquery.com/jquery-3.7.1.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>
$(function () {
    $('#user_filter').change(function () {
        const filter = $(this).val();
        const newsletterId = $('#newsletter_id').val();

        if (!newsletterId) {
            Swal.fire({
                icon: 'warning',
                title: 'Template Required',
                text: 'Please select a Template before choosing a User Filter.'
            });
            $(this).val('');
            return;
        }

        if (filter) {
            $('#loader2').show();
            $('#user-list').hide();
            $('#users-checkboxes').html('');

            $.post("{{ route('admin.getFilteredUsers') }}", {
                filter: filter,
                _token: '{{ csrf_token() }}'
            }, function (users) {
                let html = '';
                users.forEach(user => {
                    html += `<div><label><input type="checkbox" name="user_ids[]" value="${user.id}" class="mr-2">${user.name} (${user.email})</label></div>`;
                });
                $('#users-checkboxes').html(html);
                $('#user-count-label').text(`Select Users (${users.length})`);
                $('#user-list').show();
            }).always(function () {
                $('#loader2').hide();
            });
        } else {
            $('#user-list').hide();
        }
    });

    $(document).on('change', '#select-all', function () {
        const isChecked = $(this).is(':checked');
        $('#users-checkboxes input[type="checkbox"]').prop('checked', isChecked);
    });

    $('#send-newsletter-form').submit(function (e) {
        e.preventDefault();

        const form = $(this);
        const newsletterId = $('#newsletter_id').val();
        const filter = $('#user_filter').val();
        const formData = form.serialize();

        if (!newsletterId || !filter) {
            Swal.fire({
                icon: 'warning',
                title: 'Missing Fields',
                text: 'Please select both a Template and a User Filter.'
            });
            return false;
        }

        $('#loader').show();

        $.ajax({
            url: "{{ route('admin.sendNewsletter') }}",
            type: 'POST',
            data: formData,
            success: function (response) {
                $('#loader').hide();
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Emails sent successfully!'
                });
                form.trigger('reset');
                $('#users-checkboxes').html('');
                $('#user-list').hide();
            },
            error: function (xhr) {
                $('#loader').hide();
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Something went wrong: ' + xhr.responseText
                });
            }
        });
    });
});
</script>
@endpush
