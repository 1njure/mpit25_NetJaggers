import asyncio
import logging
from pathlib import Path

from vkposting import load_scheduler_from_env, parse_datetime_to_unix, vk_exception_handler


logging.basicConfig(level=logging.INFO)


async def app() -> None:
    scheduler = load_scheduler_from_env()

    # Пример: 25 декабря 11:00 по UTC+10:00
    publish_date = parse_datetime_to_unix("2025-12-25T11:00:00+10:00")

    # Опционально: прикрепить медиа (загрузится только то, что реально существует)
    photo_candidates = [Path("./examples/photo1.jpg"), Path("./examples/photo2.jpg")]
    doc_candidates = [Path("./examples/info.pdf")]
    video_candidates = [Path("./examples/video.mp4")]

    photo_paths = [str(p) for p in photo_candidates if p.exists() and p.is_file()]
    doc_paths = [str(p) for p in doc_candidates if p.exists() and p.is_file()]
    video_paths = [str(p) for p in video_candidates if p.exists() and p.is_file()]

    async with scheduler:
        # 1) Посмотреть текущее состояние отложенных постов
        scheduled = await scheduler.get_scheduled_posts(count=5, offset=0)
        logging.info("Scheduled posts ids: %s", [p.id for p in scheduled])

        # 2) Создать отложенный пост
        post_id = await scheduler.create_scheduled_post(
            message="Пост на 25 декабря 11:00 (пример main.py)",
            publish_date=publish_date,
            from_group=True,
            photo_paths=photo_paths,
            doc_paths=doc_paths,
            video_paths=video_paths,
        )
        logging.info("Created scheduled post_id=%s", post_id)

        # 3) Получить созданный пост
        post = await scheduler.get_post_by_id(post_id)
        logging.info("Fetched post: %s", post.model_dump() if post else None)

        # 4) Редактировать (например, обновить текст)
        ok = await scheduler.edit_scheduled_post(post_id, message="Обновлённый текст (main.py)")
        logging.info("Edited: %s", ok)

        # 5) Удаление (закомментировано, чтобы не удалять случайно)
        # deleted = await scheduler.delete_scheduled_post(post_id)
        # logging.info("Deleted: %s", deleted)


def main() -> None:
    with vk_exception_handler(logger=logging.getLogger(__name__)):
        asyncio.run(app())


if __name__ == "__main__":
    main()
