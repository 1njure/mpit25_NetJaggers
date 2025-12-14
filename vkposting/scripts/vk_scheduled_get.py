import argparse
import asyncio
import json
import logging

from vkposting import load_scheduler_from_env, vk_exception_handler


logging.basicConfig(level=logging.INFO)


async def _run(post_id: int) -> None:
    scheduler = load_scheduler_from_env()
    async with scheduler:
        post = await scheduler.get_post_by_id(post_id)
        if post is None:
            print("Not found")
            return
        print(json.dumps(post.model_dump(), ensure_ascii=False, indent=2))


def main() -> None:
    parser = argparse.ArgumentParser(description="Get VK wall post by id (for group owner_id)")
    parser.add_argument("post_id", type=int)
    args = parser.parse_args()

    with vk_exception_handler(logger=logging.getLogger(__name__)):
        asyncio.run(_run(post_id=args.post_id))


if __name__ == "__main__":
    main()
