from decimal import Decimal

def item_added_sender_html(locker_id: int) -> str:
    return f"""
    <h2>Item Stored Successfully</h2>
    <p>Your item has been securely stored in locker <b>{locker_id}</b>.</p>
    <p><b>Billing:</b> ₹50 per hour</p>
    """


def item_added_receiver_html(locker_id: int) -> str:
    return f"""
    <h2>Locker Access Notification</h2>
    <p>An item has been locked for you in locker <b>{locker_id}</b>.</p>
    <p>You must request an OTP to collect the item.</p>
    <p><b>Billing:</b> ₹50 per hour</p>
    """


def item_collected_sender_html(locker_id: int, amount: Decimal) -> str:
    return f"""
    <h2>Item Collected</h2>
    <p>Your item from locker <b>{locker_id}</b> has been collected successfully.</p>
    <p><b>Total Amount Charged:</b> ₹{amount:.2f}</p>
    <p>Transaction completed.</p>
    """


def item_collected_receiver_html(locker_id: int) -> str:
    return f"""
    <h2>Item Collected</h2>
    <p>The item from locker <b>{locker_id}</b> has been collected.</p>
    """
