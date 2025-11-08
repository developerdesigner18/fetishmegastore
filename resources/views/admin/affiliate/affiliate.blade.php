@extends('admin.base')

@section('section_title')
    <strong>{{ __(':type Management', ['type' => ucfirst($active)]) }}</strong>
@endsection

@section('section_body')
    <form method="GET" class="flex mb-4">
        <div>
            <label style="color: transparent">search</label>
            <x-input name="search" class="w-52 block mr-1" id="search" type="text" />
        </div>
        <div>
            <label style="color: transparent">search</label><br>
            <x-button>{{ __('Search') }}</x-button>
        </div>
    </form>

    <table class="text-stone-600 table border-collapse w-full bg-white dataTable">
        <thead>
        <tr>
            <x-th>{{ __('ID') }}</x-th>
            <x-th>{{ __('Thumb') }}</x-th>
            <x-th>{{ __('Username') }}</x-th>
            <x-th>{{ __('Name') }}</x-th>
            <x-th>{{ __('Email') }}</x-th>
            <x-th>{{ __('Actions') }}</x-th>
        </tr>
        </thead>
        <tbody>
        @foreach ($users as $u)
            <tr>
                <x-td><x-slot name="field">ID</x-slot>{{ $u->id }}</x-td>
                <x-td>
                    <x-slot name="field">Profile</x-slot>
                    <img src="{{ $u->profile_picture }}" alt="" class="w-16 h-16 rounded-full"/>
                </x-td>
                <x-td>
                    <x-slot name="field">Username</x-slot>
                    @if($u->is_streamer === 'yes')
                        <a href="{{ route('channel', ['user' => $u->username]) }}" target="_blank" class="text-cyan-600 hover:underline">
                            {{ '@' . $u->username }}
                        </a>
                    @else
                        {{ $u->username }}
                    @endif
                </x-td>
                <x-td><x-slot name="field">Name</x-slot>{{ $u->name }}</x-td>
                <x-td><x-slot name="field">Email</x-slot>{{ $u->email }}</x-td>
               <x-td>
    <x-slot name="field">Actions</x-slot>
    <select class="action-select border rounded text-sm"
            data-user-id="{{ $u->id }}"
            data-current-value="{{ $u->affiliate_vendor_verifiy }}"
            data-url="{{ route('affiliate.affiliatePendingStatus') }}">

        <option disabled selected>{{ $u->affiliate_vendor_verifiy == 1 ? 'Approved' : 'Pending' }}</option>

        @if($u->affiliate_vendor_verifiy != 1)
            <option value="1">Approve</option>
        @endif

        @if($u->affiliate_vendor_verifiy != 0)
            <option value="0">Set Pending</option>
        @endif
    </select>
</x-td>

            </tr>
        @endforeach
        </tbody>
    </table>

    {!! $users->links() !!}
@endsection

@section('extra_bottom')
    @if (count($errors) > 0)
        <div class="alert alert-danger mt-4">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
@endsection

@push('adminExtraJS')
<script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
<script src="{{ asset('js/jquery.min.js') }}"></script>
<script src="{{ asset('js/datatables/datatables.min.js') }}"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll(".action-select").forEach(function (dropdown) {
            dropdown.addEventListener("change", function () {
                const userId = this.dataset.userId;
                const selectedStatus = this.value;
                const previousValue = this.dataset.currentValue;
                const url = this.dataset.url; // ✅ Get URL from HTML attribute

                Swal.fire({
                    title: selectedStatus == 1 ? 'Approve this user?' : 'Set status to pending?',
                    icon: 'question',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, confirm',
                    cancelButtonText: 'Cancel'
                }).then((result) => {
                    if (result.isConfirmed) {
                        fetch(url, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        "X-Requested-With": "XMLHttpRequest"
    },
    body: JSON.stringify({
        id: userId,
        status: selectedStatus
    })
})
.then(response => {
    if (!response.ok) throw new Error("Server returned an error");
    return response.json(); // ✅ Parse JSON
})
.then(data => {
    console.log(data); // ✅ Now you'll see the full JSON object
    if (data.success) {
        Swal.fire({
            icon: 'success',
            title: data.message,
            confirmButtonText: 'OK'
        }).then(() => {
            window.location.reload();
        });
    } else {
        Swal.fire('Error', data.message || 'Something went wrong.', 'error');
    }
})
.catch(err => {
    console.error('Fetch error:', err);
    Swal.fire('Error', 'Server error or invalid JSON.', 'error');
});

                    } else {
                        this.value = previousValue;
                    }
                });
            });
        });
    });
</script>

@endpush
