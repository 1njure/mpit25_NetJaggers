import argparse
import asyncio
import logging
from pathlib import Path

from vkposting import load_scheduler_from_env, parse_datetime_to_unix, vk_exception_handler


logging.basicConfig(level=logging.INFO)


def _existing(paths: list[str]) -> list[str]:
    result: list[str] = []
    for p in paths:
        path = Path(p)
        if path.exists() and path.is_file():
            result.append(str(path))
    return result


async def _run(
    *,
    message: str,
    publish_date: int,
    from_group: bool,
    attachments: list[str],
    photo_paths: list[str],
    doc_paths: list[str],
    video_paths: list[str],
) -> None:
    scheduler = load_scheduler_from_env()
    async with scheduler:
        post_id = await scheduler.create_scheduled_post(
            message=message,
            publish_date=publish_date,
            from_group=from_group,
            attachments=attachments,
            photo_paths=photo_paths,
            doc_paths=doc_paths,
            video_paths=video_paths,
        )
        print(post_id)


def main() -> None:
    parser = argparse.ArgumentParser(description="Create scheduled VK wall post")
    parser.add_argument("--message", required=True)

    dt_group = parser.add_mutually_exclusive_group(required=True)
    dt_group.add_argument("--publish-date", type=int, help="Unix timestamp")
    dt_group.add_argument(
        "--publish-iso",
        type=str,
        help="ISO datetime string, e.g. 2025-12-25T11:00:00+10:00",
    )

    parser.add_argument("--from-user", action="store_true", help="Post as user instead of group")
    parser.add_argument("--attachment", action="append", default=[], help="Raw VK attachment string")
    parser.add_argument("--photo", action="append", default=[], help="Path to photo file")
    parser.add_argument("--doc", action="append", default=[], help="Path to document file")
    parser.add_argument("--video", action="append", default=[], help="Path to video file")

    args = parser.parse_args()

    if args.publish_date is not None:
        publish_date = int(args.publish_date)
    else:
        publish_date = parse_datetime_to_unix(args.publish_iso)

    with vk_exception_handler(logger=logging.getLogger(__name__)):
        asyncio.run(
            _run(
                message=args.message,
                publish_date=publish_date,
                from_group=not args.from_user,
                attachments=args.attachment,
                photo_paths=_existing(args.photo),
                doc_paths=_existing(args.doc),
                video_paths=_existing(args.video),
            )
        )


if __name__ == "__main__":
    main()
