import asyncio
import logging
from datetime import datetime, timedelta, timezone
from pathlib import Path

from vkposting import (
    VKAccessDeniedError,
    VKAPIError,
    VKAuthError,
    VKRateLimitError,
    load_scheduler_from_env,
    parse_datetime_to_unix,
    vk_exception_handler,
)


logging.basicConfig(level=logging.INFO)


async def main() -> None:
    scheduler = load_scheduler_from_env()

    async with scheduler:
        posts = await scheduler.get_scheduled_posts(count=5, offset=0)
        logging.info("Scheduled posts: %s", [p.id for p in posts])

        photo_candidates = [Path("./examples/photo1.jpg"), Path("./examples/photo2.jpg")]
        doc_candidates = [Path("./examples/info.pdf")]
        video_candidates = [Path("./examples/video.mp4")]

        photo_paths = [str(p) for p in photo_candidates if p.exists() and p.is_file()]
        doc_paths = [str(p) for p in doc_candidates if p.exists() and p.is_file()]
        video_paths = [str(p) for p in video_candidates if p.exists() and p.is_file()]

        publish_dt = datetime.now(timezone.utc) + timedelta(hours=2)
        post_id = await scheduler.create_scheduled_post(
            message="Автопост (тест) через VKWallScheduler",
            publish_date=int(publish_dt.timestamp()),
            attachments=[],
            photo_paths=photo_paths,
            doc_paths=doc_paths,
            video_paths=video_paths,
            from_group=True,
        )
        logging.info("Created scheduled post_id=%s", post_id)

        ok = await scheduler.edit_scheduled_post(post_id, message="Обновленный текст")
        logging.info("Edited: %s", ok)

        fetched = await scheduler.get_post_by_id(post_id)
        logging.info("Fetched: %s", fetched.model_dump() if fetched else None)

        ok = await scheduler.delete_scheduled_post(post_id)
        logging.info("Deleted: %s", ok)

        ts = parse_datetime_to_unix("2030-01-01T12:00:00+00:00")
        logging.info("Parsed timestamp: %s", ts)


if __name__ == "__main__":
    with vk_exception_handler(logger=logging.getLogger(__name__)):
        asyncio.run(main())
