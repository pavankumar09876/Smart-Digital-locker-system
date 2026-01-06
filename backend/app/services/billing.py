from datetime import datetime, timezone
from decimal import Decimal, ROUND_UP

RATE_PER_HOUR = Decimal("50.00")


def calculate_bill(stored_at: datetime) -> Decimal:
    now = datetime.now(timezone.utc)
    start = stored_at.astimezone(timezone.utc)

    hours = Decimal((now - start).total_seconds() / 3600)

    return (hours * RATE_PER_HOUR).quantize(
        Decimal("0.01"),
        rounding=ROUND_UP,
    )
