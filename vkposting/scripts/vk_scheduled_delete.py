import argparse
import asyncio
import logging

from vkposting import load_scheduler_from_env, vk_exception_handler


logging.basicConfig(level=logging.INFO)


async def _run(post_id: int) -> None:
    scheduler = load_scheduler_from_env()
    async with scheduler:
        ok = await scheduler.delete_scheduled_post(post_id)
        print("1" if ok else "0")


def main() -> None:
    parser = argparse.ArgumentParser(description="Delete scheduled VK wall post")
    parser.add_argument("post_id", type=int)
    args = parser.parse_args()

    with vk_exception_handler(logger=logging.getLogger(__name__)):
        asyncio.run(_run(post_id=args.post_id))


if __name__ == "__main__":
    main()
