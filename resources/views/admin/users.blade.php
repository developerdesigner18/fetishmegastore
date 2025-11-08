@extends('admin.base')

@section('section_title')
    <strong>{{ __(':type Management', ['type' => ucfirst($active)]) }}</strong>
@endsection
@section('section_body')
    <form method="GET" class="flex">
        <div >
            <label style="color: transparent">search</label>
            <x-input name="search" class="w-52 block mr-1" id="search" type="text" />

        </div>
        <div>
            <label style="color: transparent">search</label><br>
            <x-button>{{ __('Search') }}</x-button></div>
    </form>
    <table class="text-stone-600 table border-collapse w-full bg-white dataTable">
        <thead>
        <tr>
            <x-th>{{ __('ID') }}</x-th>
            <x-th>{{ __('Thumb') }}</x-th>
            <x-th>{{ __('Username') }}</x-th>
            <x-th>{{ __('Name') }}</x-th>
            <x-th>{{ __('Email') }}</x-th>
            <x-th>{{ __('Is Featured Verified') }}</x-th>
            <x-th>{{ __('Tokens') }}</x-th>
            @if($active == 'streamers')
                <x-th>{{ __('Is Verified') }}</x-th>
            @endif
            <x-th>{{ __('Is Admin') }}</x-th>
            <x-th>{{ __('IP Address') }}</x-th>
            <x-th>{{ __('Join Date') }}</x-th>
            <x-th>{{ __('Actions') }}</x-th>
        </tr>
        </thead>
        <tbody>

        @foreach ($users as $u)
            <tr>
                <x-td>
                    <x-slot name="field">{{ __('ID') }}</x-slot>
                    {{ $u->id }}
                </x-td>
                <x-td>
                    <x-slot name="field">{{ __('Profile') }}</x-slot>
                    <img src="{{ $u->profile_picture }}" alt="" class="w-16 h-16 rounded-full"/>
                </x-td>
                <x-td>
                    <x-slot name="field">{{ __('Username') }}</x-slot>
                    @if($u->is_streamer == 'yes')
                        <a href="{{ route('channel', ['user' => $u->username]) }}" target="_blank"
                           class="text-cyan-600 hover:underline">
                            {{ '@' . $u->username }}
                        </a>
                    @else
                        {{ $u->username }}
                    @endif
                </x-td>
                <x-td>
                    <x-slot name="field">{{ __('Name') }}</x-slot>
                    {{ $u->name }}
                </x-td>
                <x-td>
                    <x-slot name="field">{{ __('Email') }}</x-slot>
                    {{ $u->email }}
                </x-td>
                <x-td>
                <x-slot name="field">{{ __('Is Featured Verified') }}</x-slot>
                <div x-data="toggleFeature({{ $u->is_featured_verified ? 1 : 0 }}, '{{ csrf_token() }}', {{ $u->id }})">
                    <label class="inline-flex items-center cursor-pointer">
                        <input type="checkbox" 
                            x-model="isChecked" 
                            @change="updateValue()" 
                            class="hidden">
                        <span class="w-10 h-6 flex items-center rounded-full p-1 transition-all"
                            :class="isChecked ? 'bg-blue-500' : 'bg-red-500'"> <!-- Change color to blue or red -->
                            <span class="w-4 h-4 bg-white rounded-full shadow transition-transform transform"
                                :class="isChecked ? 'translate-x-4' : 'translate-x-0'"></span>
                        </span>
                    </label>
                </div>
            </x-td>



                <x-td>
                    <x-slot name="field">{{ __('Tokens') }}</x-slot>
                    <span class="inline-flex px-2 py-1 rounded-lg text-white bg-cyan-500">
                    {{ $u->tokens }}
                </span>

                    <a href="/admin/user/{{ $u->id }}/add-tokens"
                       class="text-stone-600 hover:underline text-xs block mt-2">{{
                    __("Adjust")
                    }}</a>
                </x-td>
                @if($active == 'streamers')
                    <x-td>
                        <x-slot name="field">{{ __('Is Admin') }}</x-slot>
                        @if($u->is_streamer_verified == 'yes')
                            <span class="px-2 py-1 inline-flex rounded-lg text-white bg-emerald-500">
                    {{ __('Yes') }}
                </span>
                        @else
                            <span class="px-2 py-1 inline-flex rounded-lg text-white bg-amber-400">
                    {{ __('No') }}
                </span>
                            <br/>
                            <a href="/admin/approve-streamer?user={{ $u->id }}"
                               class="text-xs underline">{{ __("Mark as Verified") }}</a>
                            <br/>
                            <p class="text-xs">
                                @php
                                    $policy = $u->policy ? json_decode($u->policy) : null;
                                @endphp
                                @if($policy)
                                    <div>
                                        <p>Terms: <strong>{{ $policy->terms ? 'Yes' : 'No' }}</strong></p>
                                        <p>Agreement: <strong>{{ $policy->agreement ? 'Yes' : 'No' }}</strong></p>
                                        <p>Rules: <strong>{{ $policy->rules ? 'Yes' : 'No' }}</strong></p>
                                    </div>
                                @else
                                <p>This user has not accepted any policies.</p>
                                @endif
                            </p>

                            @endif
                    </x-td>
                @endif
                <x-td>
                    <x-slot name="field">{{ __('Is Admin') }}</x-slot>
                    <span
                            class="inline-flex px-2 py-1 rounded-lg text-white {{ $u->is_admin == 'yes' ? 'bg-teal-600' : 'bg-stone-500' }}">
                    {{ ucfirst($u->is_admin) }}
                </span>
                    <br>
                    @if ($u->is_admin == 'yes')
                        <a href="/admin/users/unsetadmin/{{ $u->id }}" class="text-red-400 text-xs hover:underline">{{ __('Unset
                    Admin
                    Role') }}</a>
                    @elseif($u->is_admin == 'no')
                        <a href="/admin/users/setadmin/{{ $u->id }}" class="text-teal-600 text-xs hover:underline">{{ __('Set
                    Admin
                    Role') }}</a>
                    @endif
                </x-td>
                <x-td>
                    <x-slot name="field">{{ __('IP') }}</x-slot>
                    <span class="inline-flex px-2 py-1 bg-slate-100 text-slate-500 rounded-lg">
                    {{ $u->ip ? $u->ip : __('N/A') }}

                        {{-- {{ $u->ip ? '<a href="/admin/users/ban/'.$u->id.'>Ban IP</a>' : '' }} --}}
                </span>
                    <br>
                    @if (!$u->isBanned)
                        <a href=" /admin/users/ban/{{ $u->id }}" class="text-stone-600 hover:underline">
                            {{ __('Ban') }}
                        </a>
                    @else
                        <a href="/admin/users/unban/{{ $u->id }}" class="text-red-400 hover:underline">
                            {{ __('Unban') }}
                        </a>
                    @endif
                </x-td>
                <x-td>
                    <x-slot name="field">{{ __('Join Date') }}</x-slot>
                    {{ $u->created_at->format('jS F Y') }}
                </x-td>
                <x-td>
                    <x-slot name="field">{{ __('Actions') }}</x-slot>
                    <a href="/admin/loginAs/{{ $u->id }}"
                       onclick="return confirm('{{ __('This will log you out as an admin and login as a vendor. Continue?')  }}')"
                       class="text-teal-600 hover:underline">{{ __('Login as User') }}</a>

                    <br>
                    <br>
                    <a href="/admin/users?remove={{ $u->id }}"
                       onclick="return confirm('Are you sure you want to delete this user and his data? This is irreversible!!!')"
                       class="text-red-400 hover:underline">{{ __('Delete User & His Data') }}</a>
                </x-td>
            </tr>
        @endforeach
        </tbody>
    </table>

    {!! $users->links() !!}
@endsection

@section('extra_bottom')
    @if (count($errors) > 0)
        <div class="alert alert-danger">
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
    {{-- attention, dynamic because only needed on this page to save resources --}}
    <script>
    // $(document).ready(function() {
    //     // Initialize DataTables
    //     $('.dataTable').DataTable({
    //         "paging": true, // Enable pagination
    //         "searching": true, // Enable search bar
    //         "lengthChange": true, // Allow changing number of rows per page
    //     });
    // });
</script>


    <script>
        function toggleFeature(initialValue, csrfToken, id) {
            return {
                isChecked: !!initialValue,
                updateValue() {
                    fetch(`/admin/streamers/${id}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': csrfToken,
                        },
                        body: JSON.stringify({ is_featured_verified: this.isChecked ? 1 : 0 }),
                    })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                console.log('Update successful');
                                location.reload(); 
                            } else {
                                console.error('Update failed:', data);
                            }
                        })
                        .catch(error => console.error('Error:', error));
                }
            };
        }
    </script>

    
@endpush