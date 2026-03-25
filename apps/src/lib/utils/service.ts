"use client";

import { ServiceInitializationResult } from "@/types";
import { getRuntimeUiLocale, translateText } from "@/lib/i18n";

const LOOPBACK_PROXY_HINT =
  "若开启全局代理，请将 localhost/127.0.0.1/::1 设为直连";

function asRecord(payload: unknown): Record<string, unknown> {
  return payload && typeof payload === "object" && !Array.isArray(payload)
    ? (payload as Record<string, unknown>)
    : {};
}

function t(sourceText: string, params?: Record<string, unknown>): string {
  return translateText(getRuntimeUiLocale(), sourceText, params);
}

export function normalizeServiceAddr(raw: string): string {
  const trimmed = String(raw || "").trim();
  if (!trimmed) {
    throw new Error(t("请输入端口或地址"));
  }

  let value = trimmed;
  if (value.startsWith("http://")) {
    value = value.slice("http://".length);
  }
  if (value.startsWith("https://")) {
    value = value.slice("https://".length);
  }
  value = value.split("/")[0];

  if (/^\d+$/.test(value)) {
    return `localhost:${value}`;
  }

  const [host, port] = value.split(":");
  if (!port) return value;
  if (host === "127.0.0.1" || host === "0.0.0.0") {
    return `localhost:${port}`;
  }
  return value;
}

export function readInitializeResult(payload: unknown): ServiceInitializationResult {
  const source = asRecord(payload);
  const serverName =
    typeof source.serverName === "string"
      ? source.serverName
      : typeof source.server_name === "string"
        ? source.server_name
        : "";
  const version = typeof source.version === "string" ? source.version : "";
  const userAgent =
    typeof source.userAgent === "string"
      ? source.userAgent
      : typeof source.user_agent === "string"
        ? source.user_agent
        : "";
  return { serverName, version, userAgent };
}

export function isExpectedInitializeResult(payload: unknown): boolean {
  return readInitializeResult(payload).serverName === "codexmanager-service";
}

export function formatServiceError(error: unknown): string {
  const raw =
    error && typeof error === "object" && "message" in error
      ? error.message
      : String(error || "");
  const text = String(raw || "").trim();
  if (!text) return t("未知错误");

  const normalized = text
    .split("\n")[0]
    .trim()
    .replace(/^initialize task failed:\s*/i, "")
    .replace(/^service_initialize task failed:\s*/i, "")
    .replace(/^service_start task failed:\s*/i, "")
    .replace(/^service_stop task failed:\s*/i, "")
    .trim();

  const lower = normalized.toLowerCase();
  if (lower.includes("timed out")) return t("连接超时");
  if (lower.includes("connection refused") || lower.includes("actively refused")) {
    return t("连接被拒绝");
  }
  if (lower.includes("empty response")) {
    return t("服务返回空响应（可能启动未完成、已异常退出或端口被占用）");
  }
  if (lower.includes("port is in use") || lower.includes("unexpected service responded")) {
    return translateText(
      getRuntimeUiLocale(),
      "端口已被占用或响应来源不是 CodexManager 服务（{hint}）",
      { hint: translateText(getRuntimeUiLocale(), LOOPBACK_PROXY_HINT) },
      {
        "zh-CN": "端口已被占用或响应来源不是 CodexManager 服务（{hint}）",
        en: "The port is already in use or the response did not come from CodexManager ({hint})",
        vi: "Cổng đang bị chiếm hoặc phản hồi không đến từ dịch vụ CodexManager ({hint})",
      },
    );
  }
  if (lower.includes("missing server_name")) {
    return translateText(
      getRuntimeUiLocale(),
      "响应缺少服务标识（疑似非 CodexManager 服务，{hint}）",
      { hint: translateText(getRuntimeUiLocale(), LOOPBACK_PROXY_HINT) },
      {
        "zh-CN": "响应缺少服务标识（疑似非 CodexManager 服务，{hint}）",
        en: "The response is missing the service identifier (likely not a CodexManager service, {hint})",
        vi: "Phản hồi thiếu định danh dịch vụ (có thể không phải dịch vụ CodexManager, {hint})",
      },
    );
  }
  if (
    lower.includes("unexpected rpc response") ||
    lower.includes("expected value at line 1 column 1") ||
    lower.includes("invalid chunked body")
  ) {
    return translateText(
      getRuntimeUiLocale(),
      "响应格式异常（疑似非 CodexManager 服务，{hint}）",
      { hint: translateText(getRuntimeUiLocale(), LOOPBACK_PROXY_HINT) },
      {
        "zh-CN": "响应格式异常（疑似非 CodexManager 服务，{hint}）",
        en: "Unexpected response format (likely not a CodexManager service, {hint})",
        vi: "Định dạng phản hồi bất thường (có thể không phải dịch vụ CodexManager, {hint})",
      },
    );
  }
  if (lower.includes("no address resolved")) return t("地址解析失败");
  if (lower.includes("addr is empty")) return t("地址为空");
  if (lower.includes("invalid service address")) return t("地址不合法");
  return normalized.length > 120 ? `${normalized.slice(0, 120)}...` : normalized;
}
