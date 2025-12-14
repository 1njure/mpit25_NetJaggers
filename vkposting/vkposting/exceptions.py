from __future__ import annotations

import logging
from contextlib import AbstractContextManager
from dataclasses import dataclass
from typing import Any, Callable, Optional, Type

class VKClientError(Exception):
    pass


@dataclass
class VKAPIError(VKClientError):
    error_code: int
    error_msg: str
    request_params: Optional[list[dict[str, Any]]] = None
    method: str | None = None
    params: dict[str, Any] | None = None
    is_retryable: bool = False

    def __str__(self) -> str:
        method = self.method or "<unknown_method>"
        return f"VK API error {self.error_code}: {self.error_msg} (method={method})"


class VKAuthError(VKAPIError):
    pass


class VKAccessDeniedError(VKAPIError):
    pass


class VKRateLimitError(VKAPIError):
    pass


class VKNotFoundError(VKAPIError):
    pass


class VKValidationRequiredError(VKAPIError):
    pass


@dataclass
class VKCaptchaRequiredError(VKAPIError):
    captcha_sid: str | None = None
    captcha_img: str | None = None


class VKFloodControlError(VKAPIError):
    pass


class VKInternalServerError(VKAPIError):
    pass


class VKUnknownMethodError(VKAPIError):
    pass


class VKParameterError(VKAPIError):
    pass


class VKExceptionHandler(AbstractContextManager["VKExceptionHandler"]):
    def __init__(
        self,
        *,
        logger: logging.Logger | None = None,
        reraise: bool = False,
        callbacks: dict[Type[BaseException], Callable[[BaseException], None]] | None = None,
    ):
        self._logger = logger or logging.getLogger("vkposting")
        self._reraise = reraise
        self._callbacks = callbacks or {}

    def __exit__(self, exc_type, exc, tb) -> bool:
        if exc is None:
            return False

        for etype, cb in self._callbacks.items():
            if isinstance(exc, etype):
                try:
                    cb(exc)
                except Exception as callback_error:
                    self._logger.exception("VK exception handler callback failed: %s", callback_error)

        if isinstance(exc, VKAPIError):
            self._logger.error("%s", exc)
            if self._reraise:
                return False
            return True

        if isinstance(exc, (ValueError, VKClientError)):
            self._logger.error("%s", exc)
            if self._reraise:
                return False
            return True

        return False


def vk_exception_handler(
    *,
    logger: logging.Logger | None = None,
    reraise: bool = False,
    callbacks: dict[Type[BaseException], Callable[[BaseException], None]] | None = None,
) -> VKExceptionHandler:
    return VKExceptionHandler(logger=logger, reraise=reraise, callbacks=callbacks)


def vk_api_error_from_payload(
    error_payload: dict[str, Any],
    *,
    method: str | None = None,
    params: dict[str, Any] | None = None,
) -> VKAPIError:
    code = int(error_payload.get("error_code", -1))
    msg = str(error_payload.get("error_msg", "Unknown error"))
    req_params_list = error_payload.get("request_params")

    # VK sometimes includes extra captcha fields
    captcha_sid = error_payload.get("captcha_sid")
    captcha_img = error_payload.get("captcha_img")

    if code in (5,):
        return VKAuthError(code, msg, req_params_list, method=method, params=params, is_retryable=False)
    if code in (17,):
        return VKValidationRequiredError(code, msg, req_params_list, method=method, params=params, is_retryable=False)
    if code in (14,):
        return VKCaptchaRequiredError(
            code,
            msg,
            req_params_list,
            method=method,
            params=params,
            is_retryable=False,
            captcha_sid=str(captcha_sid) if captcha_sid is not None else None,
            captcha_img=str(captcha_img) if captcha_img is not None else None,
        )
    if code in (15, 203):
        return VKAccessDeniedError(code, msg, req_params_list, method=method, params=params, is_retryable=False)
    if code in (6,):
        return VKRateLimitError(code, msg, req_params_list, method=method, params=params, is_retryable=True)
    if code in (9, 29):
        return VKFloodControlError(code, msg, req_params_list, method=method, params=params, is_retryable=True)
    if code in (10, 13):
        return VKInternalServerError(code, msg, req_params_list, method=method, params=params, is_retryable=True)
    if code in (113,):
        return VKNotFoundError(code, msg, req_params_list, method=method, params=params, is_retryable=False)
    if code in (3,):
        return VKUnknownMethodError(code, msg, req_params_list, method=method, params=params, is_retryable=False)
    if code in (100,):
        return VKParameterError(code, msg, req_params_list, method=method, params=params, is_retryable=False)

    return VKAPIError(code, msg, req_params_list, method=method, params=params, is_retryable=False)


__all__ = [
    "VKClientError",
    "VKAPIError",
    "VKAuthError",
    "VKAccessDeniedError",
    "VKRateLimitError",
    "VKNotFoundError",
    "VKValidationRequiredError",
    "VKCaptchaRequiredError",
    "VKFloodControlError",
    "VKInternalServerError",
    "VKUnknownMethodError",
    "VKParameterError",
    "vk_api_error_from_payload",
    "VKExceptionHandler",
    "vk_exception_handler",
]
