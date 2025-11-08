<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payouts;
use App\Models\AffiliateTransactions;
use Illuminate\Support\Facades\Auth;

class WithdrawalController extends Controller
{
    public function index(Request $request)
    {
        $query = Payouts::where('status', 'pending')->with('user');

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%$search%")
                ->orWhere('payment_type', 'like', "%$search%")
                ->orWhere('user_id', 'like', "%$search%");
            });
        }

        $withdrawalList = $query->orderBy('created_at', 'desc')->paginate(10);

        // Handle empty list to avoid errors
        $firstWithdrawal = $withdrawalList->first();
        $totalCommission = 0;

        if ($firstWithdrawal) {
            $lastTransaction = AffiliateTransactions::where('user_id', $firstWithdrawal->user_id)
                ->orderBy('id', 'desc')
                ->first();
            $totalCommission = $lastTransaction ? (float)$lastTransaction->balance : 0;
        }

        $currency = (string) opt('currency', '$');
        $active = 'withdrawal list';

        return view('admin.withdrawal.index', compact('withdrawalList', 'totalCommission', 'currency', 'active'));
    }

    public function withdrawalPendingStatus(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:payouts,id',
            'action' => 'required|in:approve,reject',
            'approved_amount' => 'nullable|numeric|min:1'
        ]);

        $payout = Payouts::findOrFail($request->id);

        if ($payout->status === 'approved') {
            return response()->json(['success' => false, 'message' => 'This request is already approved and cannot be changed.']);
        }

        if ($request->action === 'approve') {
            if (!$request->approved_amount || $request->approved_amount > $payout->amount) {
                return response()->json(['success' => false, 'message' => 'Invalid approved amount.']);
            }

            $lastTransaction = AffiliateTransactions::where('user_id', $payout->user_id)
                ->orderBy('id', 'desc')
                ->first();

            $previousBalance = $lastTransaction ? (float)$lastTransaction->balance : 0;
            $approvedAmount = (float)$request->approved_amount;
            $newBalance = $previousBalance - $approvedAmount;

            AffiliateTransactions::create([
                'user_id' => $payout->user_id,
                'amount' => $approvedAmount,
                'type' => 'dr', 
                'balance' => $newBalance,
                //'description' => 'Withdrawal approved by admin'
            ]);
            $payout->update([
                'status' => 'approved',
                'approved_amount' => $approvedAmount,
                'approve_by' => auth()->id(),
                'approved_at' => now()
            ]);

            return response()->json(['success' => true, 'message' => 'Withdrawal approved and transaction recorded successfully.']);
        }

        if ($request->action === 'reject') {
            $payout->update(['status' => 'reject']);
            return response()->json(['success' => true, 'message' => 'Withdrawal rejected successfully.']);
        }

        return response()->json(['success' => false, 'message' => 'Invalid action.']);
    }



    public function approvedIndex(Request $request)
    {
        $approvedList = Payouts::with('user')->where('status', 'approved')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $active = 'approved list';
        return view('admin.withdrawal.approved-list', compact('approvedList', 'active'));
    }

    public function rejectIndex(Request $request)
    {
        $rejectList = Payouts::with('user')->where('status', 'reject')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $active = 'reject list';
        return view('admin.withdrawal.reject-list', compact('rejectList', 'active'));
    }


    public function show($id)
    {
        $payout = Payouts::with('user')->findOrFail($id);
        $lastTransaction = AffiliateTransactions::where('user_id', $payout->user_id)
            ->orderBy('id', 'desc')
            ->first();

        $balance = $lastTransaction ? $lastTransaction->balance : 0;

        $currency = (string) opt('currency', '$');
        $active = 'withdrawal details';

        return view('admin.withdrawal.details', compact('payout', 'balance', 'currency', 'active'));
    }

}
