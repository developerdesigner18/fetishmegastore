@extends('admin.base')

@section('section_title')
    <strong>{{ __(':type Management', ['type' => ucfirst($active)]) }}</strong>
@endsection

@section('section_body')
    <!-- Search Form -->
    <form method="GET" class="flex flex-wrap gap-2 mb-4 items-end">
        <div>
            <label for="search" class="sr-only">Search</label>
            <x-input name="search" id="search" class="w-52 block" type="text" placeholder="{{ __('Search...') }}" value="{{ request('search') }}" />
        </div>
        <div>
            <x-button>{{ __('Search') }}</x-button>
        </div>
    </form>

    <!-- Table -->
    <div class="overflow-x-auto bg-white rounded shadow">
        <table class="w-full text-stone-600 border-collapse">
            <thead class="bg-gray-100 border-b">
                <tr>
                    <x-th>{{ __('ID') }}</x-th>
                    <x-th>{{ __('Username') }}</x-th>
                    <x-th>{{ __('Request Amount') }}</x-th>
                    <x-th>{{ __('Payment Type') }}</x-th>
                    <x-th>{{ __('Status') }}</x-th>
                    <x-th>{{ __('Actions') }}</x-th>
                </tr>
            </thead>
            <tbody>
            @forelse ($withdrawalList as $u)
                <tr class="border-b hover:bg-gray-50">
                    <x-td><x-slot name="field">ID</x-slot>{{ $u->id }}</x-td>
                    <x-td><x-slot name="field">Username</x-slot>{{ $u->user->name }}</x-td>
                    <x-td><x-slot name="field">Request Amount</x-slot>{{ number_format($u->amount, 2) }}</x-td>
                    <x-td><x-slot name="field">Payment Type</x-slot>{{ $u->payment_type }}</x-td>
                    <x-td>
                        <x-slot name="field">Status</x-slot>
                        <select class="action-select border rounded text-sm p-1"
                            data-user-id="{{ $u->id }}"
                            data-requested-amount="{{ $u->amount }}"
                            data-url="{{ route('withdrawal.pendingStatus') }}">
                            <option value="" disabled selected>{{ ucfirst($u->status) }}</option>
                            @if($u->status === 'pending')
                                <option value="approve">Approve</option>
                                <option value="reject">Reject</option>
                            @elseif($u->status === 'reject')
                                <option value="approve">Approve</option>
                            @endif
                        </select>
                    </x-td>
                    <x-td>
                        <x-slot name="field">Actions</x-slot>
                        <a href="{{ route('withdrawal.details', $u->id) }}" class="text-blue-600 hover:text-blue-800" title="View Details">
                            <i class="fas fa-eye"></i>
                        </a>
                    </x-td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="text-center py-6 text-gray-500">
                        {{ __('No withdrawal data found') }}
                    </td>
                </tr>
            @endforelse
            </tbody>
        </table>
    </div>

    <!-- Pagination -->
    @if ($withdrawalList->hasPages())
        <div class="mt-4">
            {!! $withdrawalList->links('pagination::bootstrap-5') !!}
        </div>
    @endif
@endsection

@section('extra_bottom')
    <script>
        const currency = "{{ $currency }}";
        const totalCommission = {{ $totalCommission }};
    </script>
@endsection

@push('adminExtraJS')
<script src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
<script src="{{ asset('js/jquery.min.js') }}"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>

<script>
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".action-select").forEach(function (dropdown) {
        dropdown.addEventListener("change", function () {
            const userId = this.dataset.userId;
            const requestedAmount = parseFloat(this.dataset.requestedAmount);
            const action = this.value;
            const url = this.dataset.url;

            if (action === "approve") {
                Swal.fire({
                    title: `Approve Request`,
                    html: `
                        <p><strong>User Total Commission:</strong> ${currency}${totalCommission}</p>
                        <p><strong>User Requested Amount:</strong> ${currency}${requestedAmount}</p>
                        <input type="text" id="approved_amount" class="swal2-input" value="${requestedAmount}" min="1">
                    `,
                     didOpen: () => {
                        const input = document.getElementById("approved_amount");
                        input.addEventListener("input", function () {
                            this.value = this.value.replace(/[^0-9.]/g, '');
                            if ((this.value.match(/\./g) || []).length > 1) {
                                this.value = this.value.replace(/\.+$/, '');
                            }
                        });
                    },
                    showCancelButton: true,
                    confirmButtonText: "Approve",
                    preConfirm: () => {
                        const approvedAmount = parseFloat(document.getElementById("approved_amount").value);
                        if (!approvedAmount || approvedAmount <= 0) {
                            Swal.showValidationMessage("Please enter a valid approved amount.");
                        }
                        if (approvedAmount > requestedAmount) {
                            Swal.showValidationMessage("Approved amount cannot exceed requested amount.");
                        }
                        return approvedAmount;
                    }
                }).then((result) => {
                    if (result.isConfirmed) {
                        updateStatus(url, {
                            id: userId,
                            action: "approve",
                            approved_amount: result.value
                        });
                    }
                });
            }

            if (action === "reject") {
                Swal.fire({
                    title: "Reject Request?",
                    text: "Are you sure you want to reject this withdrawal?",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonText: "Yes, Reject"
                }).then((result) => {
                    if (result.isConfirmed) {
                        updateStatus(url, {
                            id: userId,
                            action: "reject"
                        });
                    }
                });
            }

            function updateStatus(url, data) {
                fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        "X-Requested-With": "XMLHttpRequest"
                    },
                    body: JSON.stringify(data)
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire("Updated!", data.message, "success").then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire("Error", data.message || "Something went wrong.", "error");
                    }
                })
                .catch(err => {
                    console.error(err);
                    Swal.fire("Error", "Server error.", "error");
                });
            }
        });
    });
});
</script>
@endpush
