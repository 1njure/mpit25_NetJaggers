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
    post_id: int,
    message: str | None,
    publish_date: int | None,
    from_group: bool | None,
    attachments: list[str] | None,
    photo_paths: list[str] | None,
    doc_paths: list[str] | None,
    video_paths: list[str] | None,
) -> None:
    scheduler = load_scheduler_from_env()
    async with scheduler:
        ok = await scheduler.edit_scheduled_post(
            post_id,
            message=message,
            publish_date=publish_date,
            from_group=from_group,
            attachments=attachments,
            photo_paths=photo_paths,
            doc_paths=doc_paths,
            video_paths=video_paths,
        )
        print("1" if ok else "0")


def main() -> None:
    parser = argparse.ArgumentParser(description="Edit scheduled VK wall post")
    parser.add_argument("post_id", type=int)
    parser.add_argument("--message")

    dt_group = parser.add_mutually_exclusive_group(required=False)
    dt_group.add_argument("--publish-date", type=int, help="Unix timestamp")
    dt_group.add_argument(
        "--publish-iso",
        type=str,
        help="ISO datetime string, e.g. 2025-12-25T11:00:00+10:00",
    )

    parser.add_argument("--from-group", action="store_true")
    parser.add_argument("--from-user", action="store_true")

    parser.add_argument("--attachments", action="append", default=None, help="Comma-separated or repeatable raw attachment strings")
    parser.add_argument("--photo", action="append", default=None, help="Path to photo file (repeatable)")
    parser.add_argument("--doc", action="append", default=None, help="Path to document file (repeatable)")
    parser.add_argument("--video", action="append", default=None, help="Path to video file (repeatable)")

    args = parser.parse_args()

    publish_date = None
    if args.publish_date is not None:
        publish_date = int(args.publish_date)
    elif args.publish_iso is not None:
        publish_date = parse_datetime_to_unix(args.publish_iso)

    from_group: bool | None = None
    if args.from_group and args.from_user:
        raise SystemExit("Use only one of --from-group or --from-user")
    if args.from_group:
        from_group = True
    if args.from_user:
        from_group = False

    attachments = None
    if args.attachments is not None:
        parts: list[str] = []
        for a in args.attachments:
            parts.extend([x.strip() for x in a.split(",") if x.strip()])
        attachments = parts

    photo_paths = _existing(args.photo) if args.photo is not None else None
    doc_paths = _existing(args.doc) if args.doc is not None else None
    video_paths = _existing(args.video) if args.video is not None else None

    with vk_exception_handler(logger=logging.getLogger(__name__)):
        asyncio.run(
            _run(
                post_id=args.post_id,
                message=args.message,
                publish_date=publish_date,
                from_group=from_group,
                attachments=attachments,
                photo_paths=photo_paths,
                doc_paths=doc_paths,
                video_paths=video_paths,
            )
        )


if __name__ == "__main__":
    main()
