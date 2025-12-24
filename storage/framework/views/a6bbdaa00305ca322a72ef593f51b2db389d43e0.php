<?php $__env->startSection('section_title'); ?>
    <div class="flex justify-between items-center">
        <strong><?php echo e(__('Videos Uploaded by Streamers')); ?></strong>
        <a href="<?php echo e(route('admin.videos.create')); ?>" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded">
            <i class="fa-solid fa-plus mr-2"></i><?php echo e(__('Create New Video')); ?>

        </a>
    </div>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('section_body'); ?>

<style>
img.rounded-lg.mb-3 {
    min-width: 336px;
    max-width: 336px;
    min-height: 180px;
    max-height: 180px;
}
</style>
<div class="my-5 bg-gray-200 text-gray-500 font-semibold border-2 border-gray-300 p-3 rounded">
    <?php echo e(__('Here you will find an overview of the videos uploaded by the streamers.')); ?>

</div>

<?php if(count($videos)): ?>

<div class="items-center justify-center p-5">
    <form method="GET" class="flex flex-wrap gap-3 w-full">
        <div class="flex flex-col flex-1 min-w-[180px]">
            <label>Tag: </label>
            <select name="tag[]" class="form-control block" id="tagSelect" multiple>

                <?php $__currentLoopData = $tag; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $t): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <option value=<?php echo e($t->name); ?> <?php if(in_array($t->name,request()->tag ?? [])): ?> selected <?php endif; ?>><?php echo e($t->name); ?></option>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

            </select>
        </div>
        <div class="flex flex-col flex-1 min-w-[180px]">
            <label>Vedio category: </label>
            <select name="category[]" class="form-control block" id="categorySelect" multiple>

                <?php $__currentLoopData = $category; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $c): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <option value=<?php echo e($c->id); ?> <?php if(in_array($c->id,request()->category ?? [])): ?> selected <?php endif; ?>><?php echo e($c->category); ?></option>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>

            </select>
        </div>
        <div class="flex flex-col flex-1 min-w-[180px]">
            <label>Model: </label>
            <select name="model[]" class="form-control block" id="modelSelect" multiple>

                <?php $__currentLoopData = $model; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $m): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <option value=<?php echo e($m->id); ?> <?php if(in_array($m->id,request()->model ?? [])): ?> selected <?php endif; ?>><?php echo e($m->name); ?></option>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </select>
        </div>

        <div class="flex flex-col flex-1 min-w-[180px]">
            <label>Channels: </label>
            <select name="channels[]" class="form-control block" id="channelsSelect" multiple>

                <?php $__currentLoopData = $channles; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $d): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <option value=<?php echo e($d->id); ?> <?php if(in_array($d->id,request()->channels ?? [])): ?> selected <?php endif; ?>><?php echo e($d->username); ?></option>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </select>
        </div>
        <div class="flex flex-col flex-1 min-w-[180px]">
            <label style="color: transparent">Search</label>
            <?php if (isset($component)) { $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4 = $component; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.input','data' => ['name' => 'search','class' => 'form-control block','id' => 'search','type' => 'text']] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('input'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(Illuminate\View\AnonymousComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes(['name' => 'search','class' => 'form-control block','id' => 'search','type' => 'text']); ?>
<?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4)): ?>
<?php $component = $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4; ?>
<?php unset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4); ?>
<?php endif; ?>

        </div>
        <div class="flex flex-col min-w-[120px]">
            <label style="color: transparent">Search</label>
            <?php if (isset($component)) { $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4 = $component; } ?>
<?php $component = Illuminate\View\AnonymousComponent::resolve(['view' => 'components.button','data' => []] + (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag ? (array) $attributes->getIterator() : [])); ?>
<?php $component->withName('button'); ?>
<?php if ($component->shouldRender()): ?>
<?php $__env->startComponent($component->resolveView(), $component->data()); ?>
<?php if (isset($attributes) && $attributes instanceof Illuminate\View\ComponentAttributeBag && $constructor = (new ReflectionClass(Illuminate\View\AnonymousComponent::class))->getConstructor()): ?>
<?php $attributes = $attributes->except(collect($constructor->getParameters())->map->getName()->all()); ?>
<?php endif; ?>
<?php $component->withAttributes([]); ?><?php echo e(__('Search')); ?> <?php echo $__env->renderComponent(); ?>
<?php endif; ?>
<?php if (isset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4)): ?>
<?php $component = $__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4; ?>
<?php unset($__componentOriginalc254754b9d5db91d5165876f9d051922ca0066f4); ?>
<?php endif; ?>
        </div>
    </form>
</div>

<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
    <?php $__currentLoopData = $videos; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $v): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
    <div class="mr-5 mb-5 border-2 rounded-lg">
        <div class="relative">
            <a target="_blank" href=<?php echo e(route("video.page", [ "video"=> $v->id, "slug" => $v->slug ])); ?>

                class="font-semibold dark:text-gray-100 hover:text-gray-800 text-gray-600 dark:hover:text-gray-400">
                <img src="<?php echo e($v->thumbnail); ?>" class="rounded-lg mb-3 " alt="" />
            </a>
            <div
                class="absolute top-5 left-0 bg-indigo-800 text-white font-bold text-sm uppercase rounded-tr rounded-br px-2 py-1">
                <?php echo e($v->price < 1 ? __("Free") : $v->price . __(" tokens")); ?> </div>
        </div>
        <div class="flex items-start p-2">
            <div class="w-10 flex-shrink-0 mr-2">
                <a target="_blank" href=<?php echo e(route("channel", ["user"=> $v->streamer->username])); ?>>
                    <img src=<?php echo e($v->streamer->profile_picture); ?> class="w-10 h-10 rounded-full" />
                </a>
            </div>
            <div class="flex-grow">
                <div>
                    <?php echo e($v->title); ?>








                </div>
                <div class="mt-1.5 text-xs text-gray-500 dark:text-gray-200">
                    <div>
                        <a target="_blank" href=<?php echo e(route("channel", ["user"=> $v->streamer->username])); ?>>
                            <?php echo e('@' . $v->streamer->username); ?>

                        </a>
                    </div>
                    <div class="mt-1">
                        <?php echo e($v->views === 1
                        ? __("1 view")
                        : __(":viewsCount views", ["viewsCount" => $v->views])); ?>

                    </div>
                </div>
            </div>
            <div class="text-right p-5 w-10">
                <a href="/admin/videos/edit/<?php echo e($v->id); ?>"><i class="fa-solid fa-pencil mr-2 text-teal-600"></i></a>
                <a href="/admin/videos?remove=<?php echo e($v->id); ?>"
                    onclick="return confirm('<?php echo e(__('Are you sure you want to remove this VIDEO?')); ?>')"><i
                        class="fa-solid fa-trash text-red-400"></i></a>
            </div>
        </div>

    </div>
    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
</div>
</div>

<div class="p-5">
    <?php echo e($videos->links()); ?>

</div>

<?php else: ?>
<div class="bg-white p-3 rounded">
    <?php if(request()->filled('search')): ?>
    <?php echo e(__('No videos matching ":searchTerm"', ['searchTerm' => request('search')])); ?>

    <a href="/admin/videos" class="text-cyan-600 hover:underline"><?php echo e(__("Reset Search")); ?></a>
    <?php else: ?>
    <?php echo e(__('No videos uploaded by streamers.')); ?>

    <?php endif; ?>
</div>
<?php endif; ?>
<?php $__env->stopSection(); ?>

<?php $__env->startSection('extra_bottom'); ?>
<?php if(count($errors) > 0): ?>
<div class="alert alert-danger">
    <ul>
        <?php $__currentLoopData = $errors->all(); $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $error): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
        <li><?php echo e($error); ?></li>
        <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
    </ul>
</div>
<?php endif; ?>
<?php $__env->stopSection(); ?>

<?php $__env->startPush('adminExtraJS'); ?>
<script src="<?php echo e(asset('js/jquery.min.js')); ?>"></script>
<script src="<?php echo e(asset('js/datatables/datatables.min.js')); ?>"></script>

<script>
    $('.dataTable').dataTable({ordering:false});

    var settings = {};
    new TomSelect('#tagSelect',settings);
    new TomSelect('#categorySelect',settings);
    new TomSelect('#modelSelect',settings);
    new TomSelect('#channelsSelect',settings);

</script>
</script>

<?php $__env->stopPush(); ?>
<?php echo $__env->make('admin.base', \Illuminate\Support\Arr::except(get_defined_vars(), ['__data', '__path']))->render(); ?><?php /**PATH /var/www/vhosts/fetishmegastore.com/httpdocs/resources/views/admin/videos.blade.php ENDPATH**/ ?>