"use client";

import { Boxes, Plus, TextCursorInput, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type JsonPrimitive = string | number | boolean | null;
type JsonFieldEditorMode = "auto" | "object" | "array-object" | "array-string";

type NestedPair = {
  key: string;
  value: string;
};

type KeyValuePair = {
  key: string;
  value: string;
  nestedPairs?: NestedPair[];
};

interface JsonFieldEditorProps {
  name: string;
  label: string;
  defaultValue: string;
  hint?: string;
  mode?: JsonFieldEditorMode;
  itemLabel?: string;
  itemPlaceholder?: string;
}

function safeParseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toInputString(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  return typeof value === "object" ? JSON.stringify(value) : String(value);
}

function toJsonValue(value: string): unknown {
  const trimmed = value.trim();

  if (!trimmed) {
    return "";
  }

  if (trimmed === "true") {
    return true;
  }

  if (trimmed === "false") {
    return false;
  }

  if (trimmed === "null") {
    return null;
  }

  if (/^-?\d+(\.\d+)?$/.test(trimmed)) {
    return Number(trimmed);
  }

  if (
    (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
    (trimmed.startsWith("[") && trimmed.endsWith("]"))
  ) {
    const parsed = safeParseJson(trimmed);
    if (parsed !== undefined) {
      return parsed;
    }
  }

  return value;
}

function resolveMode(
  parsed: unknown,
  mode: JsonFieldEditorMode,
): Exclude<JsonFieldEditorMode, "auto"> | "raw" {
  if (mode !== "auto") {
    return mode;
  }

  if (isPlainObject(parsed)) {
    return "object";
  }

  if (Array.isArray(parsed)) {
    if (
      parsed.every(
        (item) =>
          typeof item === "string" ||
          typeof item === "number" ||
          typeof item === "boolean" ||
          item === null,
      )
    ) {
      return "array-string";
    }

    if (parsed.every((item) => isPlainObject(item))) {
      return "array-object";
    }
  }

  return "raw";
}

function createNestedPair(): NestedPair {
  return { key: "", value: "" };
}

function createPair(): KeyValuePair {
  return { key: "", value: "" };
}

function objectToNestedPairs(source: Record<string, unknown>) {
  return Object.entries(source).map(([key, value]) => ({
    key,
    value: toInputString(value),
  }));
}

function nestedPairsToObject(pairs: NestedPair[]) {
  const next: Record<string, unknown> = {};

  for (const pair of pairs) {
    const trimmedKey = pair.key.trim();

    if (!trimmedKey) {
      continue;
    }

    next[trimmedKey] = toJsonValue(pair.value);
  }

  return next;
}

function objectToPairs(source: Record<string, unknown>) {
  return Object.entries(source).map(([key, value]) =>
    isPlainObject(value)
      ? {
          key,
          value: "",
          nestedPairs: objectToNestedPairs(value),
        }
      : {
          key,
          value: toInputString(value),
        },
  );
}

function pairsToObject(pairs: KeyValuePair[]) {
  const next: Record<string, unknown> = {};

  for (const pair of pairs) {
    const trimmedKey = pair.key.trim();

    if (!trimmedKey) {
      continue;
    }

    next[trimmedKey] = pair.nestedPairs
      ? nestedPairsToObject(pair.nestedPairs)
      : toJsonValue(pair.value);
  }

  return next;
}

function createArrayObjectItem(value?: unknown) {
  if (isPlainObject(value)) {
    return objectToPairs(value);
  }

  if (value !== undefined) {
    return [{ key: "value", value: toInputString(value) }];
  }

  return [createPair()];
}

function FieldMeta({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function PairRow({
  pair,
  index,
  onKeyChange,
  onValueChange,
  onRemove,
  onConvertToNested,
  onConvertToText,
  onNestedKeyChange,
  onNestedValueChange,
  onNestedRemove,
  onNestedAdd,
}: {
  pair: KeyValuePair;
  index: number;
  onKeyChange: (index: number, value: string) => void;
  onValueChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  onConvertToNested: (index: number) => void;
  onConvertToText: (index: number) => void;
  onNestedKeyChange: (
    index: number,
    nestedIndex: number,
    value: string,
  ) => void;
  onNestedValueChange: (
    index: number,
    nestedIndex: number,
    value: string,
  ) => void;
  onNestedRemove: (index: number, nestedIndex: number) => void;
  onNestedAdd: (index: number) => void;
}) {
  return (
    <div className="space-y-3 rounded-lg border border-border/60 bg-background/70 p-3">
      <div className="flex flex-col gap-2 md:flex-row md:items-start">
        <div className="min-w-0 flex-1 space-y-1">
          <Label className="text-xs text-muted-foreground">Key</Label>
          <Input
            value={pair.key}
            onChange={(event) => onKeyChange(index, event.target.value)}
            placeholder="title"
            className="font-mono text-sm"
          />
        </div>

        {pair.nestedPairs ? (
          <div className="min-w-0 flex-[1.4] space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">
                Object fields
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground"
                onClick={() => onConvertToText(index)}
              >
                <TextCursorInput className="mr-1 size-3" />
                Use text
              </Button>
            </div>
            <div className="space-y-2 rounded-lg border border-dashed border-border/70 bg-muted/20 p-3">
              {pair.nestedPairs.map((nestedPair, nestedIndex) => (
                <div
                  key={`nested-${index}-${nestedIndex}`}
                  className="flex flex-col gap-2 md:flex-row md:items-end"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <Label className="text-xs text-muted-foreground">Key</Label>
                    <Input
                      value={nestedPair.key}
                      onChange={(event) =>
                        onNestedKeyChange(
                          index,
                          nestedIndex,
                          event.target.value,
                        )
                      }
                      placeholder="bn"
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="min-w-0 flex-[1.3] space-y-1">
                    <Label className="text-xs text-muted-foreground">
                      Value
                    </Label>
                    <Input
                      value={nestedPair.value}
                      onChange={(event) =>
                        onNestedValueChange(
                          index,
                          nestedIndex,
                          event.target.value,
                        )
                      }
                      placeholder="Localized value"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => onNestedRemove(index, nestedIndex)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => onNestedAdd(index)}
              >
                <Plus className="size-4" />
                Add nested field
              </Button>
            </div>
          </div>
        ) : (
          <div className="min-w-0 flex-[1.4] space-y-1">
            <Label className="text-xs text-muted-foreground">Value</Label>
            <Input
              value={pair.value}
              onChange={(event) => onValueChange(index, event.target.value)}
              placeholder="Content"
              className="text-sm"
            />
          </div>
        )}

        <div className="flex items-center gap-2 self-end">
          {!pair.nestedPairs ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-10 px-2 text-xs text-muted-foreground"
              onClick={() => onConvertToNested(index)}
            >
              <Boxes className="mr-1 size-3" />
              Object
            </Button>
          ) : null}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(index)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function updatePairInList(
  pairs: KeyValuePair[],
  index: number,
  updater: (pair: KeyValuePair) => KeyValuePair,
) {
  return pairs.map((pair, pairIndex) =>
    pairIndex === index ? updater(pair) : pair,
  );
}

export function JsonFieldEditor({
  name,
  label,
  defaultValue,
  hint,
  mode = "auto",
  itemLabel = "Item",
  itemPlaceholder = "Value",
}: JsonFieldEditorProps) {
  const parsedDefault = useMemo(
    () => safeParseJson(defaultValue),
    [defaultValue],
  );
  const resolvedMode = useMemo(
    () => resolveMode(parsedDefault, mode),
    [mode, parsedDefault],
  );

  const [objectPairs, setObjectPairs] = useState<KeyValuePair[]>(() =>
    resolvedMode === "object" && isPlainObject(parsedDefault)
      ? objectToPairs(parsedDefault)
      : [],
  );
  const [stringItems, setStringItems] = useState<string[]>(() =>
    resolvedMode === "array-string" && Array.isArray(parsedDefault)
      ? parsedDefault.map((item) => toInputString(item))
      : [],
  );
  const [arrayObjectItems, setArrayObjectItems] = useState<KeyValuePair[][]>(
    () =>
      resolvedMode === "array-object" && Array.isArray(parsedDefault)
        ? parsedDefault.map((item) => createArrayObjectItem(item))
        : [],
  );

  const serializedValue = useMemo(() => {
    switch (resolvedMode) {
      case "object":
        return JSON.stringify(pairsToObject(objectPairs), null, 2);
      case "array-string":
        return JSON.stringify(
          stringItems
            .map((item) => item.trim())
            .filter(Boolean)
            .map((item) => toJsonValue(item) as JsonPrimitive),
          null,
          2,
        );
      case "array-object":
        return JSON.stringify(
          arrayObjectItems.map((item) => pairsToObject(item)),
          null,
          2,
        );
      default:
        return defaultValue;
    }
  }, [arrayObjectItems, defaultValue, objectPairs, resolvedMode, stringItems]);

  if (resolvedMode === "raw") {
    return (
      <div className="space-y-2">
        <FieldMeta label={label} hint={hint} />
        <Textarea name={name} defaultValue={defaultValue} rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <FieldMeta label={label} hint={hint} />
      <input type="hidden" name={name} value={serializedValue} />

      {resolvedMode === "object" ? (
        <div className="space-y-3 rounded-xl border border-border/70 bg-muted/10 p-4">
          {objectPairs.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No fields yet. Add the keys this section should manage.
            </p>
          ) : (
            objectPairs.map((pair, index) => (
              <PairRow
                key={`object-${index}`}
                pair={pair}
                index={index}
                onKeyChange={(pairIndex, value) =>
                  setObjectPairs((current) =>
                    updatePairInList(current, pairIndex, (pairItem) => ({
                      ...pairItem,
                      key: value,
                    })),
                  )
                }
                onValueChange={(pairIndex, value) =>
                  setObjectPairs((current) =>
                    updatePairInList(current, pairIndex, (pairItem) => ({
                      ...pairItem,
                      value,
                    })),
                  )
                }
                onRemove={(pairIndex) =>
                  setObjectPairs((current) =>
                    current.filter(
                      (_, currentIndex) => currentIndex !== pairIndex,
                    ),
                  )
                }
                onConvertToNested={(pairIndex) =>
                  setObjectPairs((current) =>
                    updatePairInList(current, pairIndex, (pairItem) => ({
                      ...pairItem,
                      value: "",
                      nestedPairs:
                        pairItem.nestedPairs && pairItem.nestedPairs.length > 0
                          ? pairItem.nestedPairs
                          : [createNestedPair()],
                    })),
                  )
                }
                onConvertToText={(pairIndex) =>
                  setObjectPairs((current) =>
                    updatePairInList(current, pairIndex, (pairItem) => ({
                      ...pairItem,
                      value: JSON.stringify(
                        nestedPairsToObject(pairItem.nestedPairs || []),
                      ),
                      nestedPairs: undefined,
                    })),
                  )
                }
                onNestedKeyChange={(pairIndex, nestedIndex, value) =>
                  setObjectPairs((current) =>
                    updatePairInList(current, pairIndex, (pairItem) => ({
                      ...pairItem,
                      nestedPairs: (pairItem.nestedPairs || []).map(
                        (nestedPair, currentNestedIndex) =>
                          currentNestedIndex === nestedIndex
                            ? { ...nestedPair, key: value }
                            : nestedPair,
                      ),
                    })),
                  )
                }
                onNestedValueChange={(pairIndex, nestedIndex, value) =>
                  setObjectPairs((current) =>
                    updatePairInList(current, pairIndex, (pairItem) => ({
                      ...pairItem,
                      nestedPairs: (pairItem.nestedPairs || []).map(
                        (nestedPair, currentNestedIndex) =>
                          currentNestedIndex === nestedIndex
                            ? { ...nestedPair, value }
                            : nestedPair,
                      ),
                    })),
                  )
                }
                onNestedRemove={(pairIndex, nestedIndex) =>
                  setObjectPairs((current) =>
                    updatePairInList(current, pairIndex, (pairItem) => ({
                      ...pairItem,
                      nestedPairs: (pairItem.nestedPairs || []).filter(
                        (_, currentNestedIndex) =>
                          currentNestedIndex !== nestedIndex,
                      ),
                    })),
                  )
                }
                onNestedAdd={(pairIndex) =>
                  setObjectPairs((current) =>
                    updatePairInList(current, pairIndex, (pairItem) => ({
                      ...pairItem,
                      nestedPairs: [
                        ...(pairItem.nestedPairs || []),
                        createNestedPair(),
                      ],
                    })),
                  )
                }
              />
            ))
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() =>
              setObjectPairs((current) => [...current, createPair()])
            }
          >
            <Plus className="size-4" />
            Add field
          </Button>
        </div>
      ) : null}

      {resolvedMode === "array-string" ? (
        <div className="space-y-3 rounded-xl border border-border/70 bg-muted/10 p-4">
          {stringItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No items yet. Add entries one by one.
            </p>
          ) : (
            stringItems.map((item, index) => (
              <div
                key={`string-item-${index}`}
                className="flex flex-col gap-2 md:flex-row md:items-end"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    {itemLabel} {index + 1}
                  </Label>
                  <Input
                    value={item}
                    onChange={(event) =>
                      setStringItems((current) =>
                        current.map((currentItem, itemIndex) =>
                          itemIndex === index
                            ? event.target.value
                            : currentItem,
                        ),
                      )
                    }
                    placeholder={itemPlaceholder}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    setStringItems((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setStringItems((current) => [...current, ""])}
          >
            <Plus className="size-4" />
            Add {itemLabel.toLowerCase()}
          </Button>
        </div>
      ) : null}

      {resolvedMode === "array-object" ? (
        <div className="space-y-4">
          {arrayObjectItems.length === 0 ? (
            <div className="rounded-xl border border-border/70 bg-muted/10 p-4">
              <p className="text-sm text-muted-foreground">
                No items yet. Add a card or list item to start.
              </p>
            </div>
          ) : (
            arrayObjectItems.map((item, itemIndex) => (
              <div
                key={`array-object-${itemIndex}`}
                className="space-y-3 rounded-xl border border-border/70 bg-muted/10 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">
                    {itemLabel} {itemIndex + 1}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-muted-foreground hover:text-destructive"
                    onClick={() =>
                      setArrayObjectItems((current) =>
                        current.filter(
                          (_, currentIndex) => currentIndex !== itemIndex,
                        ),
                      )
                    }
                  >
                    <Trash2 className="mr-2 size-4" />
                    Remove
                  </Button>
                </div>

                {item.map((pair, pairIndex) => (
                  <PairRow
                    key={`array-object-${itemIndex}-${pairIndex}`}
                    pair={pair}
                    index={pairIndex}
                    onKeyChange={(currentPairIndex, value) =>
                      setArrayObjectItems((current) =>
                        current.map((currentItem, currentItemIndex) =>
                          currentItemIndex === itemIndex
                            ? updatePairInList(
                                currentItem,
                                currentPairIndex,
                                (pairItem) => ({ ...pairItem, key: value }),
                              )
                            : currentItem,
                        ),
                      )
                    }
                    onValueChange={(currentPairIndex, value) =>
                      setArrayObjectItems((current) =>
                        current.map((currentItem, currentItemIndex) =>
                          currentItemIndex === itemIndex
                            ? updatePairInList(
                                currentItem,
                                currentPairIndex,
                                (pairItem) => ({ ...pairItem, value }),
                              )
                            : currentItem,
                        ),
                      )
                    }
                    onRemove={(currentPairIndex) =>
                      setArrayObjectItems((current) =>
                        current.map((currentItem, currentItemIndex) =>
                          currentItemIndex === itemIndex
                            ? currentItem.filter(
                                (_, innerPairIndex) =>
                                  innerPairIndex !== currentPairIndex,
                              )
                            : currentItem,
                        ),
                      )
                    }
                    onConvertToNested={(currentPairIndex) =>
                      setArrayObjectItems((current) =>
                        current.map((currentItem, currentItemIndex) =>
                          currentItemIndex === itemIndex
                            ? updatePairInList(
                                currentItem,
                                currentPairIndex,
                                (pairItem) => ({
                                  ...pairItem,
                                  value: "",
                                  nestedPairs:
                                    pairItem.nestedPairs &&
                                    pairItem.nestedPairs.length > 0
                                      ? pairItem.nestedPairs
                                      : [createNestedPair()],
                                }),
                              )
                            : currentItem,
                        ),
                      )
                    }
                    onConvertToText={(currentPairIndex) =>
                      setArrayObjectItems((current) =>
                        current.map((currentItem, currentItemIndex) =>
                          currentItemIndex === itemIndex
                            ? updatePairInList(
                                currentItem,
                                currentPairIndex,
                                (pairItem) => ({
                                  ...pairItem,
                                  value: JSON.stringify(
                                    nestedPairsToObject(
                                      pairItem.nestedPairs || [],
                                    ),
                                  ),
                                  nestedPairs: undefined,
                                }),
                              )
                            : currentItem,
                        ),
                      )
                    }
                    onNestedKeyChange={(currentPairIndex, nestedIndex, value) =>
                      setArrayObjectItems((current) =>
                        current.map((currentItem, currentItemIndex) =>
                          currentItemIndex === itemIndex
                            ? updatePairInList(
                                currentItem,
                                currentPairIndex,
                                (pairItem) => ({
                                  ...pairItem,
                                  nestedPairs: (pairItem.nestedPairs || []).map(
                                    (nestedPair, currentNestedIndex) =>
                                      currentNestedIndex === nestedIndex
                                        ? { ...nestedPair, key: value }
                                        : nestedPair,
                                  ),
                                }),
                              )
                            : currentItem,
                        ),
                      )
                    }
                    onNestedValueChange={(
                      currentPairIndex,
                      nestedIndex,
                      value,
                    ) =>
                      setArrayObjectItems((current) =>
                        current.map((currentItem, currentItemIndex) =>
                          currentItemIndex === itemIndex
                            ? updatePairInList(
                                currentItem,
                                currentPairIndex,
                                (pairItem) => ({
                                  ...pairItem,
                                  nestedPairs: (pairItem.nestedPairs || []).map(
                                    (nestedPair, currentNestedIndex) =>
                                      currentNestedIndex === nestedIndex
                                        ? { ...nestedPair, value }
                                        : nestedPair,
                                  ),
                                }),
                              )
                            : currentItem,
                        ),
                      )
                    }
                    onNestedRemove={(currentPairIndex, nestedIndex) =>
                      setArrayObjectItems((current) =>
                        current.map((currentItem, currentItemIndex) =>
                          currentItemIndex === itemIndex
                            ? updatePairInList(
                                currentItem,
                                currentPairIndex,
                                (pairItem) => ({
                                  ...pairItem,
                                  nestedPairs: (
                                    pairItem.nestedPairs || []
                                  ).filter(
                                    (_, currentNestedIndex) =>
                                      currentNestedIndex !== nestedIndex,
                                  ),
                                }),
                              )
                            : currentItem,
                        ),
                      )
                    }
                    onNestedAdd={(currentPairIndex) =>
                      setArrayObjectItems((current) =>
                        current.map((currentItem, currentItemIndex) =>
                          currentItemIndex === itemIndex
                            ? updatePairInList(
                                currentItem,
                                currentPairIndex,
                                (pairItem) => ({
                                  ...pairItem,
                                  nestedPairs: [
                                    ...(pairItem.nestedPairs || []),
                                    createNestedPair(),
                                  ],
                                }),
                              )
                            : currentItem,
                        ),
                      )
                    }
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() =>
                    setArrayObjectItems((current) =>
                      current.map((currentItem, currentIndex) =>
                        currentIndex === itemIndex
                          ? [...currentItem, createPair()]
                          : currentItem,
                      ),
                    )
                  }
                >
                  <Plus className="size-4" />
                  Add field
                </Button>
              </div>
            ))
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() =>
              setArrayObjectItems((current) => [
                ...current,
                createArrayObjectItem(),
              ])
            }
          >
            <Plus className="size-4" />
            Add {itemLabel.toLowerCase()}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
