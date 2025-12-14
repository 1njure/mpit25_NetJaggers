import argparse
import asyncio
import logging

from vkposting import load_scheduler_from_env, vk_exception_handler


logging.basicConfig(level=logging.INFO)


async def _run(count: int, offset: int) -> None:
    scheduler = load_scheduler_from_env()
    async with scheduler:
        posts = await scheduler.get_scheduled_posts(count=count, offset=offset)
        for p in posts:
            print(f"{p.id}\t{p.date}\t{p.text[:80].replace(chr(10), ' ')}")


def main() -> None:
    parser = argparse.ArgumentParser(description="List scheduled (postponed) VK wall posts")
    parser.add_argument("--count", type=int, default=10)
    parser.add_argument("--offset", type=int, default=0)
    args = parser.parse_args()

    with vk_exception_handler(logger=logging.getLogger(__name__)):
        asyncio.run(_run(count=args.count, offset=args.offset))


if __name__ == "__main__":
    main()
