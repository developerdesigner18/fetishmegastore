<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
    @foreach($videos as $v)
        <div class="mr-5 mb-5 border-2 rounded-lg">
            <div class="relative">
                @if($v->is_promo_video == 1)
                    <div class="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-tr-lg rounded-bl-lg z-10">
                        promo video
                    </div>
                @endif

                <a target="_blank" href="{{route("short.video.single.page", ["id" => $v->slug])}}">
                    <img src="{{$v->thumbnail}}" class="rounded-lg mb-3" alt="" />
                </a>
            </div>
            <div class="flex items-start p-2">
                <div class="flex-grow">
                    <div>{{$v->title}}</div>
                    <div class="mt-1.5 text-xs text-gray-500">
                        {{$v->views === 1 ? __("1 view") : __(":viewsCount views", ["viewsCount" => $v->views])}}
                    </div>
                </div>
                <div class="text-right p-5 w-10">
                    <a href="{{route('edit.short.videos',['id' => $v->id])}}">
                        <i class="fa-solid fa-pencil mr-2 text-teal-600"></i>
                    </a>
                    <a href="{{route('delete.short.videos',['id' => $v->id])}}" onclick="return confirm('{{ __('Are you sure you want to remove this VIDEO?') }}')">
                        <i class="fa-solid fa-trash text-red-400"></i>
                    </a>
                </div>
            </div>
        </div>
    @endforeach
</div>

<div class="p-5">
    {{ $videos->links() }}
</div>
