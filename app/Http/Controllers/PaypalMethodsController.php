<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use App\Models\Blog;
use App\Models\Category;
use App\Models\Tag;
use App\Models\VideoCategories;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Facades\Image;

class PaypalMethodsController extends Controller
{
    public function index(Request $request)
    {

        $payment_method = PaymentMethod::orderBy('created_at', 'desc')->get();
        return view('admin.payment-methods', compact('payment_method'));
        
    }

    public function createPaypalMethod()
    {

        //$categories = PaymentMethod::orderBy('id','desc')->get();

        return view('admin.add-paymentMethod');
    }
    public function editPaypalMethod($id)
    {
        $payment_method = PaymentMethod::find($id);
        return view('admin.edit-paymentMethod',compact('payment_method'));
    }
    
    public function addPaypalMethod(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            //'environment' => 'required|in:Sandbox,Live',
        ]);

        if ($validator->fails()) {
            return back()->with('msg', $validator->errors()->first());
        }
        try {
            $sandboxCredentials = [];
            $liveCredentials = [];
            if ($request->filled('sandbox_keys') && $request->filled('sandbox_values')) {
                foreach ($request->sandbox_keys as $index => $key) {
                    $sandboxCredentials[] = [
                        'key' => $key,
                        'value' => $request->sandbox_values[$index] ?? '',
                    ];
                }
            }
            if ($request->filled('live_keys') && $request->filled('live_values')) {
                foreach ($request->live_keys as $index => $key) {
                    $liveCredentials[] = [
                        'key' => $key,
                        'value' => $request->live_values[$index] ?? '',
                    ];
                }
            }
            PaymentMethod::create([
                'name' => $request->name,
                'environment' => $request->environment,
                'is_recurring' => $request->is_recurring,
                'sandbox_credentials' => json_encode($sandboxCredentials), 
                'live_credentials' => json_encode($liveCredentials),     
            ]);
            return redirect()->route('paypal-method.index')->with('msg', __('Payment Method Added Successfully!'));

        } catch (\Exception $exception) {
            return back()->with('msg', $exception->getMessage());
        }
    }

    
    public function updatePaypalMethod(Request $request,$id)
    {
        //prd($request->all());
        $payment_method = PaymentMethod::findOrFail($id);
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
    
        $sandboxCredentials = [];
        $liveCredentials = [];
    
        if ($request->filled('sandbox_keys') && $request->filled('sandbox_values')) {
            foreach ($request->sandbox_keys as $index => $key) {
                $sandboxCredentials[] = [
                    'key' => $key,
                    'value' => $request->sandbox_values[$index] ?? '',
                ];
            }
        }
    
        if ($request->filled('live_keys') && $request->filled('live_values')) {
            foreach ($request->live_keys as $index => $key) {
                $liveCredentials[] = [
                    'key' => $key,
                    'value' => $request->live_values[$index] ?? '',
                ];
            }
        }
        $payment_method->update([
            'name' => $request->name,
            'environment' => $request->environment,
            'is_recurring' => $request->is_recurring,
            'sandbox_credentials' => json_encode($sandboxCredentials),
            'live_credentials' => json_encode($liveCredentials),
            'status' => $request->status, 
        ]);
        return redirect()->route('paypal-method.index')->with('msg', __('Paypal Method Updated Successfully!'));
    }

    public function deletePaypalMethod($id){
        $payment_method = PaymentMethod::find($id)->delete();
        return redirect()->route('paypal-method.index')->with('msg', __('Paypal Method Deleted Successfully!'));
    }
}
