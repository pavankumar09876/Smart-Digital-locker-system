from fastapi import HTTPException,status
from app.core.redis import redis_client
from time import time
import logging

logger = logging.getLogger(__name__)

async def rate_limit(
        key:str,
        max_requests:int,
        window_seconds:int,
):
    try:
        now=int(time())

        pipe=redis_client.pipeline()
        pipe.zadd(key, {now:now})
        pipe.zremrangebyscore(key,0,now-window_seconds)
        pipe.zcard(key)
        pipe.expire(key, window_seconds)
        _,_,request_count,_= await pipe.execute()

        if request_count >  max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again later."
            )
    except Exception as e:
        logger.warning(f"Rate limiting failed due to Redis connection error: {e}. Skipping rate limit.")
        # Skip rate limiting if Redis is not available
        pass
