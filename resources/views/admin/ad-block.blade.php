@extends('admin.base')

@section('section_title')
    <strong>{{ __('Ad Blocks') }}</strong>
@endsection
@push('adminExtraJS')
    <script src="{{ asset('js/tinymce/tinymce.min.js') }}"></script>
    <script type="text/javascript">
        tinymce.init({
            selector: '.textarea',
            plugins: 'image code link lists',
            images_upload_url: '/admin/cms/upload-image',
            toolbar: 'code | formatselect fontsizeselect | insertfile a11ycheck | numlist bullist | bold italic | forecolor backcolor | template codesample | alignleft aligncenter alignright alignjustify | bullist numlist | link image tinydrive',
            promotion: false
        });
    </script>
@endpush
@section('section_body')

    <form method="POST" action="/admin/add_block" enctype="multipart/form-data">
        {{ csrf_field() }}
        <div class="flex items-center bg-white rounded p-3">

            <div>
                <select id="data" name="number" class="rounded-md ring-1 ring-black ring-opacity-5">
                    @for($i=0;$i<16;$i++)
                        <option class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                                value="{{$i}}">{{$i+1}}</option>
                    @endfor
                </select>
            </div>


            <div class="ml-3">
                <x-button>{{ __('Save') }}</x-button>
            </div>
        </div><!-- /.col-xs-12 col-md-6 -->


        <hr class="my-3"/>

        {{--        <table class="table border-collapse w-full bg-white text-stone-600">--}}
        {{--            <thead>--}}
        {{--            <tr>--}}
        {{--                <x-th>{{ __('ID') }}</x-th>--}}
        {{--                <x-th>{{ __('Name') }}</x-th>--}}
        {{--                <x-th>{{ __('Actions') }}</x-th>--}}
        {{--            </tr>--}}
        {{--            </thead>--}}
        {{--            <tbody>--}}
        {{--            @foreach ($adBlocks as $c)--}}
        {{--                <tr>--}}
        {{--                    <x-td>--}}
        {{--                        <x-slot name="field">{{ __('ID') }}</x-slot>--}}
        {{--                        {{ $c->id }}--}}
        {{--                    </x-td>--}}
        {{--                    <x-td>--}}
        {{--                        <x-slot name="field">{{ __('Category') }}</x-slot>--}}
        {{--                        {!! $c->adBlocks !!}--}}
        {{--                    </x-td>--}}
        {{--                    <x-td>--}}
        {{--                        <x-slot name="field">{{ __('Actions') }}</x-slot>--}}
        {{--                        <div class="btn-group">--}}
        {{--                            <a class="inline-flex mr-2" href="/admin/tag?update={{ $c->id }}">--}}
        {{--                                <i class="fa-solid fa-pencil text-teal-600"></i>--}}
        {{--                            </a>--}}
        {{--                            <a href="/admin/tag?remove={{ $c->id }}"--}}
        {{--                               onclick="return confirm('{{ __('Are you sure you want to remove this block from database?')  }}');"--}}
        {{--                               class="inline-flex">--}}
        {{--                                <i class="fa-solid fa-trash text-red-400"></i>--}}
        {{--                            </a>--}}
        {{--                        </div>--}}
        {{--                    </x-td>--}}
        {{--                </tr>--}}
        {{--            @endforeach--}}
        {{--            </tbody>--}}
        {{--        </table>--}}

        <textarea name="page_content" id="page_content" class="w-full textarea" rows="20">
            @if (count($adBlocks) > 0)
                {!! @$adBlocks[0]["html"] !!}
            @endif
        </textarea>
        <br>
        
        <div class="mb-3">
    <label for="block_one" class="font-bold block mb-1">{{ __('Block One(big banner): ') }}</label>
    <input type="file" name="block_one" id="block_one" class="rounded-md ring-1 ring-black ring-opacity-5 p-2 w-full" onchange="previewImage(this, 'block_one_preview')">
    
    <img id="block_one_preview" style="display:none; margin-top: 10px; max-width: 50%;" 
    src="{{ asset('/' . @$adBlocks[0]['block_one']) }}" />


</div>


        <div class="mb-3">
            <label for="block_two" class="font-bold block mb-1">{{ __('Block Two: ') }}</label>
            <input type="file" name="block_two" id="block_two" class="rounded-md ring-1 ring-black ring-opacity-5 p-2 w-full" onchange="previewImage(this, 'block_two_preview')">
            <img id="block_two_preview" style="display:none; margin-top: 10px; max-width: 100%;" 
            src="{{ asset('/' . @$adBlocks[0]['block_two']) }}" />
        </div>
    </form>
    {{--    @else--}}
    {{--        No Ad Blocks--}}
    {{--    @endif--}}
    <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
    <script>
        $(document).ready(function () {
            var adBlocks = <?php echo json_encode($adBlocks); ?>;
            $(document).on("change", "#data", function () {
                var index_val = $(this).val();
                tinymce.activeEditor.setContent("", {format: 'html'});
                $.each(adBlocks, function (index, value) {
                    if (index_val == value["number"]) {
                        tinymce.activeEditor.setContent(value["html"], {format: 'html'});
                    }
                });
            });
        });
    </script>
    <script>
        function previewImage(input, previewId) {
            var file = input.files[0];
            var reader = new FileReader();

            reader.onload = function(e) {
                var img = document.getElementById(previewId);
                img.src = e.target.result;
                img.style.display = 'block'; 
                img.style.maxWidth = '100%'; 
                img.style.marginTop = '10px'; 
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        }

        window.onload = function() {
            var blockOnePreview = document.getElementById('block_one_preview');
            var blockTwoPreview = document.getElementById('block_two_preview');
            if (blockOnePreview.src) {
                blockOnePreview.style.display = 'block';
            }
            if (blockTwoPreview.src) {
                blockTwoPreview.style.display = 'block'; 
            }
        };

</script>
@endsection