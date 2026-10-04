import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { setLanguage } from "@/i18n";

import { LoggingCallbacksTable } from "./LoggingCallbacksTable";

const baseVars = {
  SLACK_WEBHOOK_URL: null,
  LANGFUSE_PUBLIC_KEY: null,
  LANGFUSE_SECRET_KEY: null,
  LANGFUSE_HOST: null,
  OPENMETER_API_KEY: null,
};

describe("LoggingCallbacksTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    setLanguage("en");
  });

  it("should render", () => {
    render(<LoggingCallbacksTable callbacks={[]} availableCallbacks={{}} />);
    expect(screen.getByText("Active Logging Callbacks")).toBeInTheDocument();
  });

  it("should show the empty state when there are no callbacks", () => {
    render(<LoggingCallbacksTable callbacks={[]} availableCallbacks={{}} />);
    expect(screen.getByText("No callbacks configured")).toBeInTheDocument();
    expect(screen.getByText("Add your first callback to start logging data to external services.")).toBeInTheDocument();
  });

  it("should show skeleton rows while loading", () => {
    render(<LoggingCallbacksTable callbacks={[]} availableCallbacks={{}} isLoading />);
    expect(screen.getAllByTestId("skeleton-row").length).toBeGreaterThan(0);
    expect(screen.queryByText("No callbacks configured")).not.toBeInTheDocument();
  });

  it('should map "otel" to "OpenTelemetry" on the table', () => {
    render(
      <LoggingCallbacksTable
        callbacks={[{ name: "otel", variables: baseVars }]}
        availableCallbacks={{
          otel: {
            litellm_callback_name: "otel",
            litellm_callback_params: [],
            ui_callback_name: "OpenTelemetry",
          },
        }}
      />,
    );
    expect(screen.getByText("OpenTelemetry")).toBeInTheDocument();
  });

  it("should fallback to original callback name when not in availableCallbacks", () => {
    render(
      <LoggingCallbacksTable
        callbacks={[{ name: "custom_callback_x", variables: baseVars }]}
        availableCallbacks={{}}
      />,
    );
    expect(screen.getByText("custom_callback_x")).toBeInTheDocument();
  });

  it("should call onAdd when the Add Callback button is clicked", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<LoggingCallbacksTable callbacks={[]} availableCallbacks={{}} onAdd={onAdd} />);
    await user.click(screen.getByRole("button", { name: /add callback/i }));
    expect(onAdd).toHaveBeenCalled();
  });

  it("should test, edit, and delete a callback through the actions menu", async () => {
    const user = userEvent.setup();
    const onTest = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const callback = { name: "langfuse", type: "success" as const, variables: baseVars };
    render(
      <LoggingCallbacksTable
        callbacks={[callback]}
        availableCallbacks={{}}
        onTest={onTest}
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    await user.click(screen.getByTestId("callback-actions-langfuse-success"));
    await user.click(await screen.findByTestId("callback-action-test"));
    expect(onTest).toHaveBeenCalledWith(callback);

    await user.click(screen.getByTestId("callback-actions-langfuse-success"));
    await user.click(await screen.findByTestId("callback-action-edit"));
    expect(onEdit).toHaveBeenCalledWith(callback);

    await user.click(screen.getByTestId("callback-actions-langfuse-success"));
    await user.click(await screen.findByTestId("callback-action-delete"));
    expect(onDelete).toHaveBeenCalledWith(callback);
  });

  it("shows a read-only label instead of the actions menu for runtime-only callback rows", () => {
    render(
      <LoggingCallbacksTable
        callbacks={[
          { name: "langfuse", type: "success" as const, variables: baseVars },
          { name: "datadog", type: "success" as const, variables: baseVars, read_only: true },
        ]}
        availableCallbacks={{}}
        onTest={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );
    expect(screen.getByTestId("callback-actions-langfuse-success")).toBeInTheDocument();
    expect(screen.queryByTestId("callback-actions-datadog-success")).not.toBeInTheDocument();
    expect(screen.getAllByText("Read only")).toHaveLength(1);
  });

  // Regression: `/get_callbacks` returns the same `name` twice when a
  // callback is registered for both success and failure (e.g. `generic_api`
  // → POST to spend-log on both 200 and 4xx/5xx). The UI used to ignore
  // the `type` field and render every row as "Success", masking the
  // failure registration. Reading `record.type` fixes the badge AND
  // composing the row id with type avoids React's duplicate-key warning.
  it("renders distinct Success and Failure badges for same-name dual registration", () => {
    render(
      <LoggingCallbacksTable
        callbacks={[
          { name: "generic_api", type: "success", variables: baseVars },
          { name: "generic_api", type: "failure", variables: baseVars },
        ]}
        availableCallbacks={{
          generic_api: {
            litellm_callback_name: "generic_api",
            litellm_callback_params: [],
            ui_callback_name: "Custom Callback API",
          },
        }}
      />,
    );
    expect(screen.getAllByText("Custom Callback API")).toHaveLength(2);
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("Failure")).toBeInTheDocument();
  });

  // Every user-visible string on this surface has to come from the dictionary, otherwise the
  // dashboard stays half-English when the operator switches to Chinese. Asserting the Chinese
  // copy directly fails if any of these labels regress back to a hardcoded literal.
  it("renders the table chrome, mode badges and row actions in the active language", () => {
    setLanguage("zh");
    const callback = { name: "langfuse", type: "success_and_failure" as const, variables: baseVars };
    render(
      <LoggingCallbacksTable
        callbacks={[callback, { name: "datadog", type: "failure", variables: baseVars, read_only: true }]}
        availableCallbacks={{}}
        onTest={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("已启用的日志回调")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /添加回调/ })).toBeInTheDocument();
    expect(screen.getByText("成功与失败")).toBeInTheDocument();
    expect(screen.getByText("失败")).toBeInTheDocument();
    expect(screen.getByText("只读")).toBeInTheDocument();

    const modeHeaders = screen.getAllByText("模式");
    expect(modeHeaders.length).toBeGreaterThan(0);
    expect(screen.getByText("回调名称")).toBeInTheDocument();
    expect(screen.queryByText("Active Logging Callbacks")).not.toBeInTheDocument();
  });
});
