@if (isset($paypalApprovalUrl))
    <script type="text/javascript">
        window.location.href = "{{ $paypalApprovalUrl }}";
    </script>
@endif
